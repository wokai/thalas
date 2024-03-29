'use strict';
/*******************************************************************************
 * The MIT License
 * Copyright 2023, Wolfgang Kaisers
 * Permission is hereby granted, free of charge, to any person obtaining a 
 * copy of this software and associated documentation files (the "Software"), 
 * to deal in the Software without restriction, including without limitation 
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, 
 * and/or sell copies of the Software, and to permit persons to whom the 
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included 
 * in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR 
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
 * USE OR OTHER DEALINGS IN THE SOFTWARE.
 ******************************************************************************/

const path     = require('path');
const { exec } = require('child_process');
const http     = require('http');
const colors   = require('colors');


const { Device }        = require(path.join(__dirname, 'device'));
const General           = require(path.join(__dirname, '..', 'config', 'general'));
const win               = require(path.join(__dirname, '..', 'logger', 'logger'));
const { XenonOsStatus, XenonPortStatus, Episode, MedibusVentRespData, MedibusVentGasData, MedibusVentInhalData, MbDbInput } = require(path.join(__dirname, 'database'));



class Xenon extends Device {
  
  #port
  #episode /// Episode: device, value, begin, end
  #lastMsg
  
  constructor(ip, name, port) {
    super(ip, name);
    this.#port = port;
    this.#episode = null;
    this.#lastMsg = 0;
  }
  
  get port() { return this.#port; }
    
  /// ////////////////////////////////////////////////////////////////////// ///  
  /// Create Array of Xenon devices from locally stored configuration
  /// ////////////////////////////////////////////////////////////////////// ///
  static getXenonArray() {
    return General.devices.map(d => new Xenon(d.ip, d.name, d.port))
  }
  

  /// ////////////////////////////////////////////////////////////////////// /// 
  /// Management of episodes
  /// Expects episode objects of type 
  /// { uuid: string, begin: date (ISOString), end: date (ISOString) }
  /// ////////////////////////////////////////////////////////////////////// ///
  
  /**
   * @usedBy{this.newEpisode}
   * @usedBy{this.openPort}
   * @param{episode} - (uuid)
   **/
  
  async initEpisode(episode) {
    this.#episode = Episode.build({
      deviceid: this.id,
      value:  episode,
      begin:  new Date().toISOString(),
      end:    null
    })
    await this.#episode.save();
    win.def.log({ level: 'info', file: 'xenon.js', func: 'initEpisode', message: `EpisodeId: ${this.#episode.id}`});
    return this.#episode;
  }
  
  /// Results in this.#episode = null
  async endEpisode(end = new Date().toISOString()){
    if(this.#episode !== null) {
      this.#episode.end = end;
      await this.#episode.save();
      win.def.log({ level: 'info', file: 'xenon.js', func: 'endEpisode', message: `EpisodeId: ${this.#episode.id}`});
      this.#episode = null;
    }
  }
  
  async newEpisode(episode) {
    return this.endEpisode().then(() => this.initEpisode(episode));
  }  

  
  /// ////////////////////////////////////////////////////////////////////// ///
  /// Operating system data
  /// ////////////////////////////////////////////////////////////////////// ///
  
  async getOsStatus() {
    return this.getClientRoute('/system');
  }

  /// ////////////////////////////////////////////////////////////////////// ///
  /// Check Port-Status
  /// ////////////////////////////////////////////////////////////////////// ///
  
  async getPortPaths() {
    return this.getClientRoute('/port/paths')
      .then(res =>  {
        if(res.data !== null) {
          res.data = res.data.map(p => p.path);
        } else {
          res.data = [];
        }
        return res;
      })
  }
  
  async getPortStatus(){
    return this.getClientRoute('/port/status')
      .then(async res => {
        
        /// There has been no response
        if(!res.data) {
          res.data = {
            open: false,
            openText: 'No device present',
            path: null,
            baudRate: null,
            dataBits: null,
            parity: null,
            stopBits: null
          }
        }
        
        await XenonPortStatus.build({
          ip:         this.ip,
          deviceid:   this.id,
          deviceName: this.name,
          port:       this.port,
          open:       res.data.open,
          openText:   res.data.openText,
          path:       res.data.path,
          baudRate:   res.data.baudRate,
          dataBits:   res.data.dataBits,
          parity:     res.data.parity,
          stopBits:   res.data.stopBits
        }).save();
        return res;
      });
  }
  
  async openPort() {
    win.def.log({ level: 'verbose', file: 'xenon.js', func: 'openPort', message: ''});
    return this.getClientRoute('/port/open')
      .then(async status => {
        await this.initEpisode(status.data.episode)
        return status;
      });
  }
  
  /// Regular shutdown which also closes port
  async stopPort() {
    win.def.log({ level: 'verbose', file: 'xenon.js', func: 'stopPort', message: ''});
    return this.getClientRoute('/port/stop').then(async status => {
      await this.endEpisode(status.data.episode.end)
      return status;
    });
  }
  
  /// Force port closing
  async closePort() {
    return getClientRoute('/port/close').then(async status => {
      await this.endEpisode(status.data.episode.end)
      return status;
    });
  }
  
  
  /// ====================================================================== ///
  /// Requests Ventilation data from Xenon-Device and saves data to database
  /// ToDo: Eventually init Episode when interval is started without openPort
  /// ====================================================================== ///
  async getVentData() {
    if(this.#episode == null) {
      await this.openPort();
    }
    return this.getClientRoute('/data/vent')
      .then(async res => {
        if(res.data !== null ) {
          this.#lastMsg = res.data.msgId;
          try{
            await MbDbInput.saveMedibusVentRespData(res.data, this.id, this.#episode.id);
            await MbDbInput.saveMedibusVentGasData(res.data, this.id, this.#episode.id);
            await MbDbInput.saveMedibusVentInhalData(res.data, this.id, this.#episode.id);
          } catch (error) {
            win.def.log({ level: 'error', file: 'xenon.js', func: 'getVentData', message: error });
          }
          return res;
        } else {
          return res;
        }
      });
  }
  
  async queryVentData(){
    if(this.com.online) { 
      return this.getVentData();
    } else {
      return Promise.resolve();
    }
  }
}



module.exports = { Xenon }

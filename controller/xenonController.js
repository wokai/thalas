'use strict';
/*******************************************************************************
 * The MIT License
 * Copyright 2022, Wolfgang Kaisers
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

const path   = require('path');
const colors = require('colors');
const crypto = require("crypto");

const config = require(path.join(__dirname, '..', 'config', 'general'));

const win     = require('../logger/logger');

const { Xenon } = require(path.join(__dirname, '..', 'model', 'xenon'));

class XenonController {
  
  #array
  #intId
  #interval
  
  constructor() { 
    this.#array = Xenon.getXenonArray();
    this.#intId = null;
    
    /// ToDo Eventually save to database or remove this dataset
    this.#interval = {
      id: null,
      start: null,
      stop: null,
      cycles: 0
    };
  }
  
  get interval() { return this.#interval; }
  
  
  /// ////////////////////////////////////////////////////////////////////// ///
  /// Ensure that the following commands are only executed on known 
  /// Xenon-devices
  /// ////////////////////////////////////////////////////////////////////// ///
  async getXenonDevice(id) {
    return new Promise((resolve, reject) => {
      let xenon = this.#array.find(x => x.id==id)
      if(xenon === undefined){
        reject({
          com: {
            online: false,
            errno: -1,
            code: `Xenon id "${id}" not found`,
          },
          data: null
        })
      } else {
        resolve(xenon);
      }
    });
  }
  
  async ping(id){
    return this.getXenonDevice(id).then(xenon => xenon.ping())
  }
  
  async getOsStatus(id) {
    return this.getXenonDevice(id).then(xenon => xenon.getOsStatus());
  }
  
  async getPortPaths(id) {
    return this.getXenonDevice(id).then(xenon => xenon.getPortPaths());
  }

  async getPortStatus(id) {
    return this.getXenonDevice(id).then(xenon => xenon.getPortStatus());
  }

  async openPort(id) {
    return this.getXenonDevice(id).then(xenon => xenon.openPort());
  }
  
  async stopPort(id) {
    return this.getXenonDevice(id).then(xenon => xenon.stopPort());
  }

  async closePort(id) {
    return this.getXenonDevice(id).then(xenon => xenon.closePort());
  }
  
  async getVentData(id) {
    return this.getXenonDevice(id).then(xenon => xenon.getVentData());
  }
  
  
  /// ////////////////////////////////////////////////////////////////////// ///
  /// IntervalQuery
  /// ////////////////////////////////////////////////////////////////////// ///
  
  async queryDevices() {
    this.#interval.cycles++;
    return Promise.all(this.#array.map(x => x.queryVentData()))
  }
  
  stopIntervalQuery() {
    win.def.log({ level: 'info', file: 'xenonController.js', func: 'stopIntervalQuery', message: 'Stop interval'});
    if(this.#intId !== null){
      clearInterval(this.#intId);
      this.#intId = null;
      this.#interval.stop = new Date().toISOString();
    }
    return this.#interval;
  }
  
  startIntervalQuery(time = 4000) {
    win.def.log({ level: 'info', file: 'xenonController.js', func: 'startIntervalQuery', message: `Interval time: ${config.interval.time}`});
    
    this.stopIntervalQuery();
    this.#intId = setInterval(() => this.queryDevices(), time);
    
    this.#interval.id = crypto.randomBytes(16).toString("hex");
    this.#interval.start = new Date().toISOString();
    this.#interval.stop = null;
    this.#interval.cycles = 0;
    
    return this.#interval;
  }
}


const xenonController = new XenonController()

module.exports = {
  controller: xenonController
}

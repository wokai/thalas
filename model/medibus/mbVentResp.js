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

const db = require('../database');


class MedibusRespiration {
  
  #device
  #episode
  #resp
  #gas
  #inhal
  
  /// Xenon Device
  constructor(device){
    this.#device = device.id;
  }
  
  setEpisode(e) { this.#episode = e; }
  
  
  static from(res, device) {
    
    let mr =  new MedibusRespiration(device);
    
    return db.Episode.create({
      device: device.id,
      value: res.data.episode.uuid,
      begin: res.data.time
    }).then(epi => {
      mr.setEpisode(epi);
      return MedibusVentRespData.create({
          msgId:        res.data.msgId,
          device:       device.id,
          episode:      res.data.episode.uuid,
          time:         res.data.time,
          compliance:   res.data.respiration.compliance,
          peak:         res.data.respiration.peak.value,
          plateau:      res.data.respiration.plateau.value,
          peep:         res.data.respiration.peep.value,
          rate:         res.data.respiration.rate.value,
          tidalvolume:  res.data.respiration.tidalvolume.value,
          minutevolume: res.data.respiration.minutevolume.value
      });
    })
  }
  
  /*
            res.data = {
            msgId: res.data.msgId,
            time: res.data.time,
            episode: res.data.episode.uuid,
            respiration: {
              peak: res.data.respiration.peak.value,
              tidalvolume: res.data.respiration.tidalvolume.value,
              minutevolume: res.data.respiration.minutevolume.value
            },
            gas: {
              fio2: res.data.gas.fio2.value,
              feo2: res.data.gas.feo2.value,
              o2uptake: res.data.gas.o2uptake.value,
              feco2: res.data.gas.feco2.value,
              fico2: res.data.gas.fico2.value
            },
            inhalation: {
              mac: res.data.inhalation.mac,
              desflurane: {
                insp: res.data.inhalation.desflurane.insp.value,
                exp:  res.data.inhalation.desflurane.exp.value,
                cons: res.data.inhalation.desflurane.cons
              },
              sevoflurane: {
                insp: res.data.inhalation.sevoflurane.insp.value,
                exp:  res.data.inhalation.sevoflurane.exp.value,
                cons: res.data.inhalation.sevoflurane.cons
              },
              isoflurane: {
                insp: res.data.inhalation.isoflurane.insp.value,
                exp:  res.data.inhalation.isoflurane.exp.value,
                cons: res.data.inhalation.isoflurane.cons
              }
            }
          }
  */
}

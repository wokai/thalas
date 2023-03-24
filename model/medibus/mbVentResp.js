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
}

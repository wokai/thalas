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
/*
const http = require('http');
const colors = require('colors');
const path = require('path');
const { exec } = require('child_process');

const General = require(path.join(__dirname, '..', 'config', 'general'));
const { Device, DeviceCheckResult } = require(path.join(__dirname, 'database'));

/// ////////////////////////////////////////////////////////////////////////////
/// Prepare Device identities:
/// A)  Frequent random access to device properties will be required during
///     routine service. Thus Map is used instead of a simple array
/// B)  The IP asssociated integer value is used as key value and as 
///     unique database primary key id-column
///     
/// ////////////////////////////////////////////////////////////////////////////


/// Convert IP-string to number and back
class Devices {
  
  static StringToNumber(ip) {
    let bytes = ip.split('.').map(x => parseInt(x));
    return (
      (bytes[0] * Math.pow(2, 24)) + 
      (bytes[1] * Math.pow(2, 16)) + 
      (bytes[2] * Math.pow(2,  8)) + 
       bytes[3]
      );
  }
  
  static NumberToString(ip) {
    let n = Number.isInteger(ip) ? ip : parseInt(ip);
    return [ (n >> 24) & 0xff, (n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff].join('.');
  }
  
  #devices        /// Map containing device obejcts, keys : IP-string ('127.0.0.1')
  #array
  
  constructor() {
  
    /// Add numeric ip-representation
    let dev = General.devices.map(d => {
        d.id = Devices.StringToNumber(d.ip);
        return d;
      })
      
    this.#array = dev;    
    this.#devices =  new Map(dev.map(i => [i.ip, i])); 
  }
  
  getArray() { return this.#array; }
  
  /// ////////////////////////////////////////////////////////////////////// ///
  /// Check if host is reachable via ping
  /// ////////////////////////////////////////////////////////////////////// ///
  async ping(ip) {
    
    return new Promise((resolve, reject) => {
      
      let device = this.#devices.get(ip);
      if(!device) {
        reject({
          ip: ip,
          success: false,
          result: 'Unknown host'
        })
      } else {

        exec(`ping -c 1 ${device.ip}`, (error, stdout, stderr) => {
          if (error) {
            reject({
              ip: ip,
              success: false,
              result: error
            })
          } else {
            resolve({
              ip: ip,
              success: true,
              result: stdout
            })
          }
        })
        
      } /// else
    })  /// Promise
  }

  /// ////////////////////////////////////////////////////////////////////// ///
  /// Check device
  /// ////////////////////////////////////////////////////////////////////// ///
  async checkDevice(ip) {

    return new Promise((resolve, reject) => {
      let device = this.#devices.get(ip);
      let result = undefined;
      
      if(!device) { /// Map returns undefined upon querying unknown key
        reject( {
          online: false,
          query: ip,
          message: '[Devices] checkDevice: Device not registered.'
        })
      } else {
        http.get({
          host: device.ip,
          port: device.port,
          path: '/system'
        }, 
        (res) => {
          let body = "";
          res.on("data", (chunk) => { body += chunk; });
          res.on("end", () => {
            
            /// Exception should never been thrown here...
            let dev;
            try {
              dev = JSON.parse(body); 
            } catch(error) {
              dev = error;
            }
            
            DeviceCheckResult.upsert({
              ip: device.ip,
              deviceid: device.id,
              port: device.port,
              interface: dev.interface,
              online: true,
              hostname: dev.hostname,
              freemem: dev.freemem,
              totalmem: dev.totalmem,
              uptime: dev.uptime
            });
            resolve({
              online: true,
              message: 'success',
              status: dev
            })

          })
        }).on('error', function(error) {
          
          /// ////////////////////////////////////////////////////////////// ///
          /// errno: -101, code: 'ENETUNREACH'
          /// errno: -111, code: 'ECONNREFUSED'
          /// ////////////////////////////////////////////////////////////// ///
          DeviceCheckResult.upsert({
            ip: device.ip,
            port: device.port,
            online: false,
            errno: error.errno
          });
          resolve({
            online: false,
            message: 'Host not online',
            status: error
          })
        }); 
      }
    });
  }
}


const devices = new Devices();

module.exports = {
  devices: devices
}
*/

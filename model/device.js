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
 
const { exec } = require('child_process');
const http     = require('http');
const colors   = require('colors');
const path     = require('path');
const General  = require(path.join(__dirname, '..', 'config', 'general'));

class Device {
  
  /// ////////////////////////////////////////////////////////////////////// ///
  /// Static functions
  /// ////////////////////////////////////////////////////////////////////// ///
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
  
  /// Used for filling database (initDatabase)
  static getDeviceArray() {
    return General.devices.map(d => {
      d.id = Device.StringToNumber(d.ip);
      return d;
    })
  }
  
  /// ////////////////////////////////////////////////////////////////////// ///
  /// Private variables and constructor
  /// ////////////////////////////////////////////////////////////////////// ///
  
  #id
  #ip
  #name
  #com    /// Status of last communication
  
  constructor(ip, name) {
    this.#ip = ip;
    this.#id = Device.StringToNumber(ip);
    this.#name = name;
    this.#com = {
      online: false,
      errno: 0,
      code: ''
    }
  }
  
  /// ////////////////////////////////////////////////////////////////////// ///
  /// Public accessors
  /// ////////////////////////////////////////////////////////////////////// ///
  
  get id()      { return this.#id; }
  get ip()      { return this.#ip; }
  get name()    { return this.#name; }
  get com()     { return this.#com; }
  
  getDataObject() {
    return {
      id: this.#id,
      ip: this.#ip,
      name: this.#name,
      com: this.#com
    }
  }
  
  /// ////////////////////////////////////////////////////////////////////// ///
  /// Check if host is reachable via ping
  /// ////////////////////////////////////////////////////////////////////// ///
  async ping() {
    
    return new Promise((resolve, reject) => {
      exec(`ping -c 1 ${this.#ip}`, (error, stdout, stderr) => {
        if (error) {
          /// error.cmd
          this.#com.online = false;
          /// See: angular.thalas device.service: DeviceData
          resolve({
            com: {
              online: false,
              errno: -101,
              code: "ENETUNREACH"
            },
            data: false
          })

        } else {
          this.#com.online = true;
          resolve({
            com: {
              online: true,
              errno: 0,
              code: "Success"
            },
            data: true
          })
        }
      })  /// exec
    })    /// Promise
  }       /// ping
  
  /// ////////////////////////////////////////////////////////////////////// ///
  /// Generig accessor for client routes
  /// ////////////////////////////////////////////////////////////////////// ///
  async getClientRoute(route) {
    return new Promise((resolve, reject) => {
      http.get({
        host: this.ip,
        port: this.port,
        path: route
      }, 
      (res) => {
        let body = "";
        res.on("data", (chunk) => { body += chunk; });
        res.on("end", () => {
          /// Exception should never been thrown here...
          let data;
          try { data = JSON.parse(body); } catch(error) { data = error; }
          
          /// Set device status
          this.#com.online = true;
          this.#com.errno = 0;
          this.#com.code = 'Success';
          
          /// Return result
          resolve({
            com: this.#com,
            data: data
          });
        }) /// on 'end'
      }).on('error', error => {
        /// ////////////////////////////////////////////////////////////// ///
        /// errno: -101, code: 'ENETUNREACH'
        /// errno: -111, code: 'ECONNREFUSED'
        /// ////////////////////////////////////////////////////////////// ///
        this.#com.online = false;
        this.#com.errno = error.errno;
        this.#com.code = error.code;
        /// Return result
        resolve({
          com: this.#com,
          data: null
        });
      }); 
    }); /// Promise
  }     /// getClientRoute
  
  
} /// class Device



module.exports = { Device }

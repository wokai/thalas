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

const path   = require('path');
const colors = require('colors');

const config = {
  language : {
    locale : 'de-DE'
  },
  logger: {
    level: 'info'
  },
  database: {
    host: '127.0.0.1',
    user: 'xxx',
    name: 'thalas',
    password: 'xxx',
    host: '127.0.0.1',
    port: 3306,
    tables: {
      params: 'medibusParameters'
    }
  },
  content : {
    params : {
      filename: path.join(__dirname, '..', 'medibusParams.json')
    }
  },
  locations : [ /// units
    {
      id: 0,
      name: 'icu',
      rooms: [
        { id:  1, name:  '1' },
        { id:  2, name:  '2' },
        { id:  3, name:  '3' },
        { id:  4, name:  '4' },
        { id:  5, name:  '5' },
        { id:  6, name:  '6' },
        { id:  7, name:  '7' },
        { id:  8, name:  '8' },
        { id:  9, name:  '9' },
        { id: 10, name: '10' }
      ]
    }
  ],
  devices : [
    {
      name: 'Localhost',
      ip: '127.0.0.1',        /// 2130706433
      port: 4000
    },
    {
      name: 'Zeus',
      ip: '192.168.178.22',
      port: 4000
    },
    {
      name: 'Unknown',
      ip: '240.0.0.0',
      port: 4000
    }
  ],
  inhalation: [
    {
      id: 0,
      name: 'sevoflurane',
      label: 'Sevoflurane',
      db: 'S'
    },
    {
      id: 1,
      name: 'desflurane',
      label: 'Desflurane',
      db: 'D'
    },
    {
      id: 2,
      name: 'isoflurane',
      label: 'Isoflurane',
      db: 'I'
    }
  ],
  interval: {
    time: 4000
  }
}

try {
  let local = require("./local.config");
  
  /// Copy values
  config.database = local.database;
  config.locations = local.locations;
  config.devices = local.devices;
  
} catch {
  console.log('[config/general] No local-config.js found. Using default values'.brightYellow);
}

/// //////////////////////////////////////////////////////////////////////// ///
/// Logger levels
/// error:   0
/// warn:    1 
/// info:    2 (default)
/// http:    3
/// verbose: 4 
/// debug:   5 
/// silly:   6 
/// //////////////////////////////////////////////////////////////////////// ///

module.exports = Object.freeze(config);



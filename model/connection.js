'use strict';
/*******************************************************************************
 * The MIT License
 * Copyright 2021, Wolfgang Kaisers
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
 
const colors = require('colors');
const path = require('path');

const General = require(path.join(__dirname, '..', 'config', 'general'));

/// ////////////////////////////////////////////////////////////////////////////
/// Prepare Device identities:
/// A)  Frequent random access to device properties will be required during
///     routine service. Thus Map is used instead of a simple array
/// B)  The IP asssociated integer value is used as key value and as 
///     unique database primary key id-column
///     
/// ////////////////////////////////////////////////////////////////////////////


/// Convert IP-string to number and back
class Connection {
  
  #device
  
  constructor(device) {
    this.#device = {
      ip = device.ip,
      begin = new Date()
    }
  }
  
  
}



module.exports = {
  Connection
}

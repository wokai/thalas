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
const fs = require('fs');

const General = require(path.join(__dirname, '..', 'config', 'general'));
const { sequelize, MedibusParameter } = require(path.join(__dirname, 'database'));

/// //////////////////////////////////////////////////////////////////////// ///
/// Maintains data for Medibus Parameters
///
/// Example: 
/// MEDIBUS for Primus, Primus IE, Apollo and Pallas, p.9:
/// 06H Compliance mL/mbar XX.X
/// //////////////////////////////////////////////////////////////////////// ///

class Parameters {
  #params
  
  constructor(){
    MedibusParameter.findAll()
    .then(res => res.map(p => p.dataValues) )
    .then(res => { this.#params = res })
  }
  
  
  async saveToJson() {
    /// Include spacer for readability
    let js = JSON.stringify([... this.#params.values()], null, 2);
    return fs.promises.writeFile(General.content.params.filename, js);
  }
  
  upsertToArray(val) {
    let i = this.#params.findIndex(p => { return p.id == val.id; })
    if(i >= 0) { 
      this.#params[i] = val;
    } else  {
      this.#params.push(val);
    }
  }
  
  async upsert(val) {
    this.upsertToArray(val);
    return MedibusParameter.upsert(val);
  }
  
  get array () { return this.#params; }
  get size  () { return this.#params.size; }
}

const parameters = new Parameters();


module.exports = {
  parameters
}


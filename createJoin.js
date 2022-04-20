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

const colors     = require('colors');
const path       = require('path');
const fs         = require('fs');
const { Sequelize, Model, DataTypes } = require('sequelize');


const General    = require(path.join(__dirname, 'config', 'general'));
const { Device } = require(path.join(__dirname, 'model', 'device'));

const db = require(path.join(__dirname, 'model', 'database'));


/// //////////////////////////////////////////////////////////////////////// ///
/// Read Medibus Parameter set from JSON
/// //////////////////////////////////////////////////////////////////////// ///

class JsonParam {
  #params
  
  constructor(){
    this.#params = new Map();
    
    var a = JSON.parse(fs.readFileSync(General.content.params.filename));
    const iter = a.values();
    for (const val of iter) {
      /// Use code as key
      this.#params.set(val.code, val);
    }
  }
  
  async save() {
    /// Include spacer for readability
    let js = JSON.stringify([... this.#params.values()], null, 2);
    return fs.promises.writeFile(General.content.params.filename, js);
  }
  
  /// No Check for integrity
  /// (i.e. expected data fields)
  async upsert(val) {
    this.#params.set(val.code, val);
    return this.save();
  }
  
  get array ()  { return [...this.#params.values()]; }
  get size  ()  { return this.#params.size; }
  get       (i) { return this.#params.get(i); }
}

const Param = new JsonParam();

/// //////////////////////////////////////////////////////////////////////// ///
/// Thalas database:
/// 1) (Re-) Create tables
/// 2) Fill medibusParameter table from JSON file
/// //////////////////////////////////////////////////////////////////////// ///


console.log('[initDatabase] Thalas: Create tables and insert data'.yellow)

db.sequelize.authenticate()
  .then((seq) => {
    return db.MedibusVentRespData.findAll({
    attributes: [
      'episode',
      [Sequelize.fn('count', Sequelize.col('id')), 'cnt']
    ],
    group: ['episode']
    })
  })
  .then((res) => {
    return res.map(m => m.dataValues);
  }).then((res) => {
    console.log(res);
  })
  .catch(error => {
    console.log(`[Sequelize] Error: ${error}`.red);
  })
  .finally(() => {
    db.sequelize.close();
  })


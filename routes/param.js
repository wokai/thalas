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

const express = require('express');
const path = require('path');

const Model = require(path.join('..', 'model', 'parameters'));
const router = express.Router();


/// Get complete list of all parameters
/// http://localhost:4040/param/
router.get('/',  function(request, result, next){
  result.status(200).json(Model.parameters.array);
});


/// //////////////////////////////////////////////////////////////////////// ///
/// TransactResultType
/// status:  string
/// success: boolean
/// reason:  string
/// //////////////////////////////////////////////////////////////////////// ///

/// //////////////////////////////////////////////////////////////////////// ///
/// Update object
/// //////////////////////////////////////////////////////////////////////// ///


router.post('/update', (request, result) => {
  /// Expects: request.body = { code : ...}
  Model.parameters.update(request.body)
   .then(() => {
      console.log('[param.update] Save updated Map of size: %i'.green, Model.parameters.size)
      result.status(200).json({ status: 'Success', success: true,  reason: '' })
    })
    .catch(err => {
      console.log('[param.update] Saving update error: '.red, err);
      result.status(500).json({ status: 'Error',   success: false, reason: err });
    })
})

router.post('/upsert', (request, result) => { 
    Model.parameters.upsert(request.body)
    .then(res  => {
      //console.log(`[param.upsert] Update param code id ${request.body.id} success.`);
      result.status(200).json({ status: 'Success', success: true,  reason: '' }) 
    }).catch(err => {
      console.log(`[param.upsert] Update param code id ${request.body.id} error: ${err}.`);
      result.status(500).json({ status: 'Error',   success: false, reason : err })
    })
});

router.get('/save', (request, result) => {
  Model.parameters.saveToJson().
    then(() => {
      console.log('[param.save] Array size: %i'.green, Model.parameters.size)
      result.status(200).json({ status: 'Success', success: true, reason: '' })
    })
});

/// //////////////////////////////////////////////////////////////////////// ///
/// Inserts one new object into entrez collection and returns ID
/// 
/// Currently does not update JSON file ....
/// This can be done using .saveToJson(): see /save
/// //////////////////////////////////////////////////////////////////////// ///
router.post('/insert', (request, result) => {
  /// Expects: request.body = { code : ...}
  Model.parameters.upsert(request.body)
   .then(() => {
      console.log('[param.insert] Save updated Map of size: %i'.green, Model.parameters.size)
      result.status(200).json({ status: 'Success', success: true,  reason: '' }) 
    })
    .catch(err => {
      console.log('[param.insert] Saving update error: '.red, err);
      result.status(500).json({ status: 'Error',   success: false, reason : err });
    })
});


module.exports = router;

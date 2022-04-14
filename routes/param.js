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

const express = require('express');
const path = require('path');

const Model = require(path.join('..', 'model', 'parameters'));
const router = express.Router();


/// Get complete list of all parameters
router.get('/',  function(request, result, next){
  result.status(200).json(Model.parameters.array);
});


/// //////////////////////////////////////////////////////////////////////// ///
/// Update object
/// //////////////////////////////////////////////////////////////////////// ///


router.post('/update', (request, result) => {
  
  /// Expects: request.body = { code : ...}
  Model.parameters.update(request.body)
   .then(() => {
      console.log('[param.update] Save updated Map of size: %i'.green, Model.parameters.size)
      result.status(200).json({ status: 'OK' })
    })
    .catch(reason => {
      console.log('[param.update] Saving update error: '.red, reason);
      result.status(500).json({ status: 'Error', reason: reason });
    })
})

router.post('/upsert', (request, result) => {
    /// Workaround ...
    request.body.updatedAt = new Date();
    
    Model.parameters.upsert(request.body)
    .then(res  => result.status(200).json({ status: 'Success', result: res }))
    .catch(err => result.status(500).json({ status: 'Error',   result: err }))
    
});


router.get('/save', (request, result) => {
  Model.parameters.saveToJson().
    then(() => {
      console.log('[param.save] Array size: %i'.green, Model.parameters.size)
      result.status(200).json({ status: 'OK' })
    })
});

/// //////////////////////////////////////////////////////////////////////// ///
/// Inserts one new object into entrez collection and returns ID
/// //////////////////////////////////////////////////////////////////////// ///


/// Currently does not update ...
router.post('/insert', (request, result) => {
  
  /// Expects: request.body = { code : ...}
  Model.parameters.upsert(request.body)
   .then(() => {
      console.log('[param.insert] Save updated Map of size: %i'.green, Model.parameters.size)
      result.status(200).json({ status: 'OK' })
    })
    .catch(reason => {
      console.log('[param.insert] Saving update error: '.red, reason);
      result.status(500).json({ status: 'Error', reason: reason });
    })
});


module.exports = router;

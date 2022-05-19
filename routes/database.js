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

const express = require('express');
const http    = require('http');
const path    = require('path');
const { Op }  = require('sequelize');
const colors  = require('colors');


const { Device, XenonOsStatus, Episode, MedibusVentRespData, MedibusVentGasData, MedibusVentInhalData }   = require(path.join('..', 'model', 'database'));
const General = require(path.join('..', 'config', 'general'));

const episode_router = require('./episode');


const router = express.Router();

router.use('/episode', episode_router);

/// Get complete list of all parameters
router.get('/device',  function(request, result, next){
  Device.findAll().then(res => {
    result.status(200).json(res);
  });
});

router.get('/resp/:episode', function(request, result, next) {
  MedibusVentRespData.findAll({
    attributes: [ 'time', 'compliance', 'peak', 'plateau', 'peep', 'rate', 'tidalvolume', 'minutevolume'],
    where: {
      episodeId: request.params.episode
    },
    raw : true
  }).then(res => { result.status(200).json(res); });
});

router.get('/gas/:episode', function(request, result, next) {
  MedibusVentGasData.findAll({
    attributes: [ 'time', 'fio2', 'feo2', 'o2uptake', 'fico2', 'feco2' ],
    where: {
      episodeId: request.params.episode,
    },
    raw : true
  }).then(res => { result.status(200).json(res); });
});


router.get('/inhal/:episode', function(request, result, next) {
  MedibusVentInhalData.findAll({
    attributes: [ 'time', 'mac', 'gas', 'insp', 'exsp', 'cons' ],
    where: {
      episodeId: request.params.episode,
    },
    raw : true
  }).then(res => { result.status(200).json(res); });
});

/// ------------------------------------------------------------------------ ///
/// Interval query
/// interval object: { id, cycles }
/// ------------------------------------------------------------------------ ///

/// //////////////////////////////////////////////////////////////////////// ///

module.exports = router;

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
const colors  = require('colors');
const fs      = require('fs');

const Model   = require(path.join('..', 'model', 'parameters'));
const General = require(path.join('..', 'config', 'general'));

const { Device }     = require(path.join('..', 'model', 'device'));
const { controller }  = require(path.join(__dirname, '..', 'controller', 'xenonController'));

const router = express.Router();


/// Get complete list of all parameters
router.get('/',  function(request, result, next){
  result.status(200).json(General.devices.map(d => {
        d.id = Device.StringToNumber(d.ip);
        return d;
      })) ;
});

router.get('/location', function(request, result, next) {
  result.status(200).json(General.locations);
});

router.get('/ping/:devid', function(request, result, next){
  controller.ping(request.params.devid)
    .then(res  => result.status(200).json(res))
    .catch(err => result.status(200).json(err))
});

router.get('/os/:devid', function(request, result, next) {
  controller.getOsStatus(request.params.devid)
    .then(res  => result.status(200).json(res))
    .catch(err => result.status(200).json(err))
});

router.get('/port/paths/:devid', function(request, result, next) {
  controller.getPortPaths(request.params.devid)
    .then(res  => result.status(200).json(res))
    .catch(err => result.status(500).json(err))
});

router.get('/port/status/:devid', function(request, result, next){
  controller.getPortStatus(request.params.devid)
    .then(res  => result.status(200).json(res))
    .catch(err => result.status(200).json(err))
});

router.get('/port/open/:devid', function(request, result, next){
  controller.openPort(request.params.devid)
    .then(res  => result.status(200).json(res))
    .catch(err => result.status(200).json(err))
});

router.get('/port/stop/:devid', function(request, result, next){
  controller.stopPort(request.params.devid)
    .then(res  => result.status(200).json(res))
    .catch(err => result.status(200).json(err))
});

router.get('/port/close/:devid', function(request, result, next) {
  controller.closePort(request.params.devid)
    .then(res  => result.status(200).json(res))
    .catch(err => result.status(200).json(err))
});

router.get('/port/vent/:devid', function(request, result, next) {
  controller.getVentData(request.params.devid)
    .then(res  => result.status(200).json(res))
    .catch(err => result.status(200).json(err))
});


/// ------------------------------------------------------------------------ ///
/// Interval query
/// interval object: { id, cycles }
/// Interval data is not written into the database
/// ------------------------------------------------------------------------ ///

router.get('/interval/start', function(request, result, next) {
  let res = controller.startIntervalQuery();
  result.status(200).json(res);
});

router.get('/interval/stop', function(request, result, next) {
  let res = controller.stopIntervalQuery();
  result.status(200).json(res);
});

router.get('/interval/status', function(request, result, next) {
  result.status(200).json(controller.interval);
});

/// //////////////////////////////////////////////////////////////////////// ///



module.exports = router;

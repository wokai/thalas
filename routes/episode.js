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
const { Sequelize, Op }  = require('sequelize');
const colors  = require('colors');

const router = express.Router();

const { Device, XenonOsStatus, Episode, MedibusVentRespData, MedibusVentGasData, MedibusVentInhalData } = require(path.join('..', 'model', 'database'));


router.get('/', function(request, result, next) {
  Episode.findAll({ order: [['id', 'DESC' ]] }).then(res => {
    result.status(200).json(res);
  });
});


router.get('/resp', function(request, result, next) {
  MedibusVentRespData.findAll({
    attributes: [
      'id',
      'msgId',
      'tidalvolume'
      ],
    order: [['id', 'DESC' ]],
    limit: 5,
    include: {
      model: Episode,
      attributes: ['begin', 'end' ]
    }
  }).then(res => {
    result.status(200).json(res);
  });
});

/// http://localhost:4040/db/episode/count/resp
/// curl http://localhost:4040/db/episode/count/resp
router.get('/count/resp', function(request, result, next){
  MedibusVentRespData.findAll({
    attributes: [
      'episodeId',
      [Sequelize.fn('count', Sequelize.col('episodeId')), 'respcount']
    ],
    group: ['episodeId'],
    include: {
      model: Episode,
      attributes: ['begin', 'end' ]
    },
    raw: true /// Query returns simple object array
  }).then(res => {
    console.log(`[routes/episode] /count/resp [0]`, res[0]);
    result.status(200).json(res.map(e => { 
      return {
        id: e.episodeId,
        count: e.respcount,
        begin: e['episode.begin'],
        end: e['episode.end']
      }
    }));
  });
});


module.exports = router;

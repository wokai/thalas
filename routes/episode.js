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


router.get('/resp/tv', function(request, result, next) {
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


/// //////////////////////////////////////////////////////////////////////// ///
/// Query:
/// http://localhost:4040/db/episode/count/resp
/// curl http://localhost:4040/db/episode/count/resp
/// //////////////////////////////////////////////////////////////////////// ///
router.get('/count/resp', function(request, result, next){

  MedibusVentRespData.findAll({
    attributes: [
      'episodeId',
      [Sequelize.fn('count', Sequelize.col('episodeId')), 'respcount']
    ],
    group: ['episodeId'],
    order: [['episodeId', 'DESC' ]],
    include: {
      model: Episode,
      attributes: [ 'id', 'deviceid', 'value', 'begin', 'end' ]
    },
    raw: true /// Query returns simple object array
  }).then(res => {
    result.status(200).json(res.map(e => {
        return {
          id: e.episodeId,
          deviceid: e['episode.deviceid'],
          value: e['episode.value'],
          count: e.respcount,
          begin: e['episode.begin'],
          end: e['episode.end']
        }
      })
    );
  });
});

router.get('/resp', function(request, result, next){

  MedibusVentRespData.findAll({
    attributes: [
      'episodeId',
      [Sequelize.fn('count', Sequelize.col('episodeId')), 'respcount'],
      [Sequelize.fn('max',   Sequelize.col('time')), 'respbegin'     ],
      [Sequelize.fn('min',   Sequelize.col('time')), 'respend'       ]
    ],
    group: ['episodeId'],
    order: [['episodeId', 'DESC' ]],
    include: {
      model: Episode,
      attributes: [ 'id', 'deviceid', 'value', 'begin', 'end' ]
    },
    raw: true /// Query returns simple object array
  }).then(res => {
    result.status(200).json(res.map(e => {
        return {
          eid: e.episodeId,
          edeviceid: e['episode.deviceid'],
          evalue: e['episode.value'],
          ebegin: e['episode.begin'],
          eend: e['episode.end'],
          rcount: e.respcount,
          rbegin: e.respbegin,
          rend: e.respend
        }
      })
    );
  });
});


router.put('/update/time', function(request, result, next){
  
  const begin = new Date(request.body.begin);
  const end = new Date(request.body.end);
  
  /// Return error
  if((typeof value !== 'number') | isNaN(begin.getTime()) | isNaN(end.getTime())){
    result.status(400).json(0);
    return;
  }
  
  Episode.update({
    begin: new Date(request.body.begin),
    end: new Date(request.body.end)
  }, {
    where: { id: request.body.id }
  })
  .then(res => {
    /// res = [ 1 ] on success
    result.status(200).json(res[0]);
  })
})

module.exports = router;

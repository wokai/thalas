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

/// Thalassa, greek mythology: Prehistoric spirit of the sea.
///
/// See:
/// //////////////////////////////////////////////////////////////////////// ///
/// Thallassa
/// https://archive.org/details/ausfhrlichesle05rosc/page/221/mode/1up?view=theater
/// //////////////////////////////////////////////////////////////////////// ///

const express       = require('express');
const path          = require('path');
const cookieParser  = require('cookie-parser');
const morgan        = require('morgan');
const colors        = require('colors');

const index_router  = require('./routes/index');
const param_router  = require('./routes/param');
const device_router = require('./routes/device');
const db_router     = require('./routes/database');

const app = express();



/// Colored morgan output on console:
app.use(
  morgan(function (tokens, req, res) {
    return [
      colors.green(tokens.method(req, res)),
      colors.yellow(tokens.url(req, res)),
      colors.green(tokens.status(req, res)),
      colors.yellow(' -' + (tokens.res(req, res, 'content-length') | '' ) + '-'),
      colors.cyan(tokens['response-time'](req, res) + ' ms')
    ].join(' ')
  })
);


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/',        index_router);
app.use('/param',   param_router);
app.use('/device',  device_router);
app.use('/db',      db_router);


/// ////////////////////////////////////////////////////////////////////////////
/// Error Handling
/// ////////////////////////////////////////////////////////////////////////////
app.use((err, req, res, next) => {
  /// Eventually log errors here ... ?
  console.log('[app.js] Error caught: %s'.brightRed, err);
  res.status(500).send(err.stack);
});


process.on('uncaughtException', error => {  
    console.error(`[Process] Error: ${error.message}\n[Process] Exit.`.brightRed);
    console.error(error)
    process.exit(1);
});
process.on('unhandledRejection', error => {  
    console.error(`[Process] unhandledRejection: ${error.message}\n[Process] Exit.`.brightRed);  
    console.error(error)
    process.exit(1);
});



module.exports = app;

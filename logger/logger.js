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

const dateformat = require("dateformat");

const winston = require('winston');
const { format } = winston;
const { combine, label, json } = format;
const General = require('../config/general');

const fs = require('fs');
const path = require('path');


/// //////////////////////////////////////////////////////////////////////// ///
/// GitHub Winston: "CHILL WINSTON! ... I put it in the logs."
/// https://www.urbandictionary.com/define.php?term=Chill%20Winston
/// Comes from The Lenny Henry Show from the late 80's in the UK.
/// He often tell his friend Winston to calm down - "chill, Winston".
/// https://www.comedy.co.uk/tv/the_lenny_henry_show/
/// //////////////////////////////////////////////////////////////////////// ///

/// //////////////////////////////////////////////////////////////////////// ///
/// Levels
/// error:   0
/// warn:    1 
/// info:    2 
/// http:    3
/// verbose: 4 
/// debug:   5 
/// silly:   6 
/// //////////////////////////////////////////////////////////////////////// ///


/// //////////////////////////////////////////////////////////////////////// ///
/// Use winston predefined logger container
/// //////////////////////////////////////////////////////////////////////// ///

const logformat = winston.format.printf( ({ level, label, message, timestamp, file, func, stack}) => {

  if(!file)  { file = '-'; }
  if(!func)  { func = '-';  }
  if(!stack) { stack = '-'; }
  
  /// Can be parsed as csv-format with delimiter |
  return `[${timestamp}] | Level: ${level} | File: ${file} | Function: ${func} | Message: ${message} | Stack: ${stack}`
});


const consTransport = new winston.transports.Console({
      format: winston.format.colorize({ all: true })
})


/// //////////////////////////////////////////////////////////////////////// ///
/// Check and eventually create directory for logfiles
/// //////////////////////////////////////////////////////////////////////// ///

let logdir = path.join(__dirname, '..', 'logfiles');

if (!fs.existsSync(logdir)){
  console.log(`[logger.js] Logging directory '${logdir}' does not exist (will be created).`.yellow)
  fs.mkdirSync(logdir);
}



/// //////////////////////////////////////////////////////////////////////// ///
/// Dayly rotating file log
/// //////////////////////////////////////////////////////////////////////// ///

const logfile = 'win_' + dateformat(new Date(), 'yyyy-mm-dd') + '.log';
const logpath = path.join(logdir, logfile);

const flog = fs.createWriteStream(logpath, { flags: 'a' })
const fileTransport = new winston.transports.Stream({ stream: flog });

 
const def = winston.createLogger({
  format: winston.format.combine(
    winston.format.label({label: 'default'}),
    winston.format.timestamp({ format: 'DD.MM.YYYY | HH:mm:ss' }),
    winston.format.splat(),
    logformat
  ),
  transports: [
    consTransport,
    fileTransport
  ],
  /** See app.js : uncaughtException
  exceptionHandlers: [ redisTransport ],
  **/
  level: General.logger.level,  /// Default: info
  exitOnError: false
});


/// Usage:
/// def.log({ level: 'info', file: 'File_name.js', func: 'Function name', message: `Log Message`});

module.exports = {
  def : def
};


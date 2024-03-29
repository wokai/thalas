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


const path = require('path');


/// //////////////////////////////////////////////////////////////////////// ///
/// Example:
/// Lung compliance
/// Concept
/// https://browser.ihtsdotools.org/snowstorm/snomed-ct/browser/MAIN/2021-07-31/concepts/3863008
///
/// Children
/// https://browser.ihtsdotools.org/snowstorm/snomed-ct/browser/MAIN/2021-07-31/concepts/3863008/children?form=inferred
///
/// Parent:
/// https://browser.ihtsdotools.org/snowstorm/snomed-ct/browser/MAIN/2021-07-31/concepts/3863008/parents?form=inferred
///
/// See also:
/// https://github.com/IHTSDO/SNOMED-in-5-minutes/blob/master/curl-examples/README.md
/// //////////////////////////////////////////////////////////////////////// ///

const config = {
  url : {
    base: 'browser.ihtsdotools.org/snowstorm/snomed-ct/browser/MAIN/2019-07-31/concepts/109152007'
  }
  versions : [
    '2021-07-31',
    '2021-01-31',
    '2020-07-31',
    '2020-01-31'
  ]
}


module.exports = Object.freeze(config);



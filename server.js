/*********************************************************************************
The MIT License (MIT)

Copyright (c) 2013   ʞɐǝɹɟʞǝǝƃ

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
**********************************************************************************/

GLOBAL.CURRENT_ANGLE = 0 ;

var connect    = require("connect") ;
var URL        = require("url") ;

var helmetPort = 8080 ;

// CONSTANTS
var LOG_ENABLED  = false ;
var LOG_VERBOSE  = LOG_ENABLED && true ;

var log = function log() {
  
  var ink = {
    reset     : "\x1b[39m"
  , black     : "\x1b[30m"
  , red       : "\x1b[31m"
  , green     : "\x1b[32m"
  , yellow    : "\x1b[33m"
  , blue      : "\x1b[34m"
  , violet    : "\x1b[35m"
  , cyan      : "\x1b[36m"
  , lightGrey : "\x1b[37m"
  , grey      : "\x1b[90m"     
  }

  var message = Array.prototype.slice.call(arguments).join(ink.cyan + ' , ' + ink.reset) ;
  
  LOG_ENABLED && console.log(ink.blue + new Date().toString().split(" ")[4] + ink.violet + " [" + process.pid + '] ' + ink.reset + message + ink.reset) ;
    
} ;

var angleIsValid = function angleIsValid(angle) {
  return !isNaN(parseFloat(angle)) && isFinite(angle) && (angle >= 0) && (angle <= 180) ;
} ; 

// add logging token for current angle.
connect.logger.token('angle', function(request, response){ 
  var newangle = URL.parse(request.url).pathname.replace(/\D/,'') ;
    return "\x1b[33m "+ CURRENT_ANGLE +"\u00B0 \x1b[39m\u25B7" + (angleIsValid(newangle)?"\x1b[32m ":"\x1b[31m ") + (newangle||CURRENT_ANGLE) +"\u00B0 \x1b[39m" ;
})

var loggingOptions = { 
  immediate: true
, format: "\x1b[3m:remote-addr:\x1b[39m:angle :url" 
} ;

// listen for requests.
connect.createServer(
  connect.favicon()
  , connect.logger(loggingOptions)
  , function(request, response) { 
  
      var angle = URL.parse(request.url).pathname.replace(/\D/,'') ; // needs parse
        
      if (angleIsValid(angle)) { 
        log(angle, CURRENT_ANGLE) ;
        CURRENT_ANGLE = angle ; //  set current value
      } else {
        LOG_VERBOSE && log(request.socket.remoteAddress, request.url, angle, CURRENT_ANGLE) ;    
      }
        
      response.writeHead(200, {
        'Content-type': 'text/plain'
      });
      response.write(CURRENT_ANGLE+"\n") ;
      response.end() ;  
      
    }
).listen(helmetPort) ;

log("listening for helmet on " + helmetPort) ;

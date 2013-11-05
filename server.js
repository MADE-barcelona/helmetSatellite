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
var LOG_VERBOSE  = true ;
var SERVE_STATIC = false ;

var log = function() {
    
  var clrFgReset   = "\x1b[39m" ; // reset
    
  var clrBlack     = "\x1b[30m" ; // Black
  var clrGrey      = "\x1b[90m" ; // Grey
  var clrLightGrey = "\x1b[37m" ; // Light Grey
  var clrRed       = "\x1b[31m" ; // Red
  var clrGreen     = "\x1b[32m" ; // Green
  var clrBlue      = "\x1b[34m" ; // Blue
  var clrYellow    = "\x1b[33m" ; // Yellow
  var clrViolet    = "\x1b[35m" ; // Violet
  var clrCyan      = "\x1b[36m" ; // Cyan

  var message = Array.prototype.slice.call(arguments).join(clrRed+','+clrFgReset);
  
  console.log(clrRed + new Date().toString().split(" ")[4] + clrViolet + " [" + process.pid + '] ' + clrFgReset + message + clrFgReset) ;
    
} ;

function angleValid(angle) {
  return !isNaN(parseFloat(angle)) && isFinite(angle) && (angle >= 0) && (angle <= 180) ;
} ; 

// launch bridging server
connect.createServer(
    connect.favicon()
    , connect.logger({ format: "\x1b[31mhelmet:\x1b[39m :remote-addr :method :status :url :response-time" })
    , function(request, response) { 
    
        var angle = URL.parse(request.url).pathname.replace(/\D/,'') ; // needs parse

        if (angleValid(angle)) { 
          log(angle, CURRENT_ANGLE) ;
          CURRENT_ANGLE = angle ; //  set current value
        } else {
          LOG_VERBOSE && log(request.socket.remoteAddress, request.url, angle, CURRENT_ANGLE) ;    
        }
                
        response.writeHead(200, {

        });
        response.write(CURRENT_ANGLE+"\n") ;
        response.end() ;
        
    }
    
).listen(helmetPort) ;

log("listening for hemlet on " + helmetPort ) ;

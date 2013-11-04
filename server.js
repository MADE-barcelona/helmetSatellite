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

var connect    = require("connect") ;

// CONSTANTS
var LOG_VERBOSE = false ;
var SERVE_STATIC = false ;

var log = function(message) {

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

    console.log(clrGrey + new Date().toString().split(" ")[4] + "[" + process.pid + '] ' + clrLightGrey + message + clrFgReset) ;
}

        // launch github webhook api listener
        connect.createServer(
            connect.favicon()
          , connect.logger({ format: "\x1b[31mgithub:\x1b[39m :remote-addr :method :status :url :response-time" })
          , connect.bodyParser()
          , function(request, response) {
            
              var angle = request.url; // needs parse

              LOG_VERBOSE && log(angle);
            
              if (angleNotValid(angle)) {
                  response.writeHead(404, {
                      "Content-Type": "text/plain"
                  });
                  response.write("404 Not Found\n") ;
                  response.end() ;
              } else {
                // Valid angle recd. need to echo to remote server.
                var http = require('http');

                //The url we want is: 'www.random.org/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new'
                var options = {
                    host: 'www.random.org'
                ,   path: '/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new'
                };

                callback = function(response) {
                  var str = '';
                  response.on('data', function (chunk) {
                    str += chunk;
                  });

                  response.on('end', function () {
                    console.log(str); // return response to original req.
                  });       
                }
                http.request(options, callback).end();
              }
           }
        ).listen(helmetPort) ;

        log("listening for hemlet on " + helmetPort ) ;
 
}) ;

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

// UPM library for Adxl345 accelerometer
//var upm = require('jsupm_adxl345');

var app = express();

// Setup websocket
var ws = require('websocket').server;
var http = require('http');

var server = http.createServer();
server.listen(3001, function() {
    console.log('WebSocket listening on port 3001\n');
});

// Create the server
wss = new ws({
    httpServer: server
});

const addon = require('@agilatech/htu21d');
 
// create an instance on the I2C bus 2 at address 0x40
const htu21d = new addon.Htu21d('/dev/i2c-1', 0x40);
const name = htu21d.deviceName();  // returns string with name of device
const version = htu21d.deviceVersion(); // returns this software version
const active = htu21d.deviceActive(); // true if active, false if inactive
const numVals =  htu21d.deviceNumValues();

console.log('sensor data: ');
console.log(numVals);

// WebSocket server
wss.on('request', function(request) {
    var connection = request.accept(null, request.origin);
    console.log('Connection request from ' + request.remoteAddress + ' accepted\n');

    var gatherData = setInterval(function() {

	const paramVal0  = htu21d.valueAtIndexSync(0);
	const paramVal1  = htu21d.valueAtIndexSync(1);
  
    // Serialize and send the accelerometer data as JSON
    connection.send('{"temperature_C": ' + paramVal1 + ', "humidity": ' + paramVal0 +'}');
    }, 2000); // Send the data every 100 ms

    // If client sends something back
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            // Process WebSocket message
            console.log('Message from ' + request.remoteAddress + ' : ' + message.data + '\n');
        }
    });

    connection.on('close', function(connection) {
        // Close remote connection
        console.log('Connection from ' + request.remoteAddress + ' closed\n');
        clearInterval(gatherData);
    });
});

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler
app.use(function(err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

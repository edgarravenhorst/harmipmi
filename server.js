var express         = require('express');
var app             = express();                  // create our app w/ express
var morgan          = require('morgan');          // log requests to the console (express4)
var bodyParser      = require('body-parser');     // pull information from HTML POST (express4)
var methodOverride  = require('method-override'); // simulate DELETE and PUT (express4)
var path            = require('path');

// ---- configuration ----

var servers = {
  'examples': { port: 8082, path: path.resolve(__dirname + '/examples/')},
  'default': { port: 8081, path: path.resolve(__dirname + '/app/screens/1/')}
};

var rootPath = servers.default.path;
var serverPort = servers.default.port;
if (process.argv.length == 3 && servers[process.argv[2]]) {
  rootPath = servers[process.argv[2]].path;
  serverPort = servers[process.argv[2]].port;
}

app.use(express.static(rootPath));                              // set the static files location
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

// ---- routes ----

app.get('*', function(req, res) { res.sendFile(rootPath + '/index.html'); });

// ---- listen ---- (start app with node server.js)
app.listen(serverPort);
console.log('\x1b[47m\x1b[34m %s \x1b[0m', '                                                                                ');
console.log('\x1b[47m\x1b[34m %s \x1b[0m', 'Development server for IPMI client applications                                 ');
console.log('\x1b[47m\x1b[34m %s \x1b[0m', 'Options:                                                                        ');
console.log('\x1b[47m\x1b[34m %s \x1b[0m', ' * \x1b[31mnpm start\x1b[34m (default, serve application in app directory)                      ');
console.log('\x1b[47m\x1b[34m %s \x1b[0m', ' * \x1b[31mnpm start examples\x1b[34m (serve examples directory)                                ');
console.log('\x1b[47m\x1b[34m %s \x1b[0m', '                                                                                ');
console.log('');
console.log('\x1b[1m %s \x1b[0m', 'Server listening on port \x1b[31m' + serverPort + '\x1b[0m');
console.log('\x1b[1m %s \x1b[0m', ' - serving: ', rootPath);
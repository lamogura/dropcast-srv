'use strict';

require('colors'); // adds color helpers to string

var http           = require('http');
var express        = require('express');
var inspect        = require('util').inspect;
var config         = require('config');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var errorHandler   = require('errorhandler');

var app = express();

var environment = app.get('env');

app.set('port', process.env.PORT || config.port || 3000);

app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));
app.use(methodOverride());

// TURN OFF CACHING
app.use(function(req, res, next) {
  res.header('Cache-Control', 's-maxage=0, max-age=0, must-revalidate, no-cache');
  res.header('Pragma', 'no-cache');
  next();
});

// FORCE SSL IN PRODUCTION
app.use(function(req, res, next) {
  if (environment === 'production' && req.headers['x-forwarded-proto'] !== 'https') {
    var route = req.get('Host') + req.url;
    log.info('Redirecting non-HTTPS route: ' + route);
    res.status(301).redirect('https://' + route);
  } 
  else {
    next();
  }
});

// MY OWN ROUTE LOGGER MIDDLEWARE
app.use(function(req, res, next) {
  var msg = '' + (req.method + ' ' + req.url);
  var bodyKeys = Object.keys(req.body);
  if (bodyKeys.length > 0) {
    var maxValueLen = 20;
    var abbreviatedBody = {};
    bodyKeys.forEach(function(key) {
      var value = req.body[key];
      if (value.length > maxValueLen) {
        value = value.substr(0, maxValueLen) + '...';
      }
      abbreviatedBody[key] = value;
    });
    msg += ', with body: ' + inspect(abbreviatedBody);
  }
  log.info(msg.inverse);
  next();
});

if (environment !== 'production') {
  app.use(errorHandler());
}

log.info('*** starting ' + environment + ' mode ***');

require('./api')(app); // sets up all api routes

var doRecreateDB = false;

if (environment !== 'test') {
  if (environment === 'production') {
    doRecreateDB = false;    
  }
  db.sequelize.sync({force: doRecreateDB}).then(function() {
    if (doRecreateDB) {
      log.warn('****** DROPPED ALL TABLES IN DB ******');
    }

    log.info('Using database "' + db.sequelize.config.database + '" ' +
      '@ ' + db.sequelize.config.host + ':' + db.sequelize.config.port);

    db.models.Podcast.ensurePodcastsInDatabase().then(function() {
      http.createServer(app).listen(app.get('port'), function() {
        log.info('Express server listening on port ' + (app.get('port')));
      });
    });
  });
}

// export self for testing
module.exports = app;

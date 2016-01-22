'use strict';

var addRoutesToApp = function (app) {
  app.use('/api/admin', require('./admin.routes'));
};

module.exports = addRoutesToApp;

'use strict';

var config = require('config');

global.log = config.logger;

var lodash = require('lodash');

global._ = lodash;

lodash.mixin({ 'isDefined': function () {
  return !_.isUndefined.apply(_, arguments);
}}, { 'chain': false });

var Sequelize = require('sequelize');

var sequelize = new Sequelize(config.db.name,
                              config.db.username,
                              config.db.password,
                              config.db.options);

var models = require('./models').importModelsToDatabase(sequelize);

global.db = {
  Sequelize: Sequelize,
  sequelize: sequelize,
  models: models
};

'use strict';

var Helpers = {};

Helpers.isSequelizeModelInstance = function (doc, modelName) {
  var name = _.get(doc, 'Model.name');
  return _.isDefined(name) ? name === modelName : false;
};

var DocumentNotFoundError = function (modelName, field, value) {
  this.name = 'DocumentNotFoundError';
  this.message = 'Could not find ' + modelName + ' with ' + field + '=' + value;
};
DocumentNotFoundError.prototype = new Error();
DocumentNotFoundError.prototype.constructor = DocumentNotFoundError;

Helpers.DocumentNotFoundError = DocumentNotFoundError;

module.exports = Helpers;

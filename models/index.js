'use strict';

var path = require('path');
var fs   = require('fs');

function filterObject (obj, filter, doRemoveNull) {
  filter = _.defaults({}, filter);
  doRemoveNull = _.isDefined(doRemoveNull) ? doRemoveNull : false;

  if (_.isDefined(filter.only)) {
    obj = _.pick(obj, [].concat(filter.only));
  }
  if (_.isDefined(filter.without)) {
    obj = _.omit(obj, [].concat(filter.without));
  }
  if (doRemoveNull) {
    obj = _.omit(obj, function (val) { 
      return val === null;
    });
  }
  return obj;
}

// pass in an instance of sequelize to load models on it
function importModelsToDatabase (sequelize) {
  var models = fs.readdirSync(__dirname)
    .filter(function (file) {
      return _.endsWith(file, '.js') && file !== 'index.js';
    })
    .reduce(function (collection, file) {
      var modelPath = path.join(__dirname, file);
      var model = sequelize.import(modelPath);

      // inject this into every instance of every model
      model.Instance.prototype.toJSON = function() {
        var filterFn = _.get(this, 'Model.toJSONAttributesFilter');
        var filterOnlyWithout = filterFn ? filterFn() : {};
        var filteredValues = filterObject(this.get(), filterOnlyWithout, true);
        return filteredValues;
      };
      collection[model.name] = model;
      return collection;
    }, {});

  Object.keys(models).forEach(function (modelName) {
    if ('associate' in models[modelName]) {
      log.debug('Loaded sequelize model w/ associations: ' + modelName);
      return models[modelName].associate(models);
    } else {
      return log.debug('Loaded sequelize model: ' + modelName);
    }
  });
  
  sequelize.models = models;

  return models;
}

module.exports = {
  importModelsToDatabase: importModelsToDatabase
};

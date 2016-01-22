var Helpers = {};

// SEQUELIZE GENERIC FUNCTIONS
Helpers.fetchAll = function (model, req, res) {
  return model.findAll()
    .then(res.json.bind(res))
    .catch(function (err) {
      return res.status(404).json({error: err});
    });
};

Helpers.fetchById = function (model, req, res) {
  return model.find({where: {id: req.params.id}})
    .then(function (doc) { 
      res.json(doc.get()); 
    })
    .catch(function (err) { 
      res.status(404).json({error: err}); 
    });
};

Helpers.destroyById = function (model, req, res) {
  return model.destroy({where: {id: req.params.id}})
    .then(function() { 
      res.json({result: 'deleted id=' + req.params.id}); 
    })
    .catch(function (err) { 
      res.status(404).json({error: err}) ;
    });
};

Helpers.destroyAll = function (model, req, res) {
  return model.destroy({where: {}})
    .then(function() { 
      res.json({result: 'all deleted'}); 
    })
    .catch(function (err) { 
      res.status(404).json({error: err}); 
    });
};

module.exports = Helpers;

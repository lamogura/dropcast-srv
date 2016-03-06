'use strict';

var fs      = require('fs');
var path    = require('path');
var router  = require('express').Router();
var Helpers = require('./helpers');

var Podcast  = db.models.Podcast;
var Episode = db.models.Episode;

// ALL ROUTES AUTHENTICATED
var adminPassword = 'sonic';

router.use(ensureAdmin);

function ensureAdmin (req, res, next) {
  log.info('Validating admin');
  if (req.headers.xadmin !== adminPassword) {
    return res.status(401).json({error: 'Must be an admin!'});
  } 
  return next();
}

router.get('/podcasts/:id/episodes', function (req, res) {
  Podcast
    .findById(req.params.id, {include: [Episode]})
    .then(function (podcast) {
      res.json(podcast.Episodes);
    });
});


// Podcasts
router.get('/podcasts', Helpers.fetchAll.bind(null, Podcast));

router.get('/discovery', function (req, res) {
  var discoveryFile = fs.readFileSync(path.join(__dirname, '../stubs/discovery.json'));
  var discoveryInfo = JSON.parse(discoveryFile);

  log.info(require('util').inspect(discoveryInfo));
  res.json(discoveryInfo);
});

router.delete('/podcasts', Helpers.destroyAll.bind(null, Podcast));

module.exports = router;

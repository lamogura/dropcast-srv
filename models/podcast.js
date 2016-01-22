'use strict';

var inspect = require('util').inspect;
var path    = require('path');
var fs      = require('fs');
var Promise = require('bluebird');

var readdir  = Promise.promisify(fs.readdir);
var readFile = Promise.promisify(fs.readFile);

module.exports = function (sequelize, DataTypes) {
  var Promise = sequelize.Promise;

  var Podcast = sequelize.define('Podcast', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: DataTypes.TEXT,
    imageUrl: DataTypes.STRING,
    websiteUrl: DataTypes.STRING
  }, {
    classMethods: {
      associate: function (models) {
        Podcast.hasMany(models.Episode, {foreignKey: 'podcastId'});
      },

      createFromJSON: function (json) {
        var Episode = sequelize.models.Episode;

        var info = _.pick(json, ['title', 'description']);
        info.imageUrl = json.cover_url;
        info.websiteUrl = json.link;

        log.info("Loading podcast: ", info.title);

        return Podcast
          .create(info)
          .then(function (Podcast) {
            return Promise
              .map(json.episodes, function (jsonWord) {
                return Episode.createFromJSON(jsonWord);
              })
              .then(function (createdEpisodes) {
                return Podcast.setEpisodes(createdEpisodes);
              })
              .then(function() {
                return Podcast;
              });
          });
      },

      ensurePodcastsInDatabase: function() {
        return Podcast.count().then(function (count) {
          if (count === 0) {
            var podcastDir = path.resolve(__dirname, '../stubs');
            log.info('Loading Podcasts from directory: ', podcastDir);

            return readdir(podcastDir)
              .filter(function (file) {
                return file.indexOf('.json') > -1;
              })
              .map(function (file) {
                log.info('Loading Podcast file: ' + file);
                return readFile(path.resolve(__dirname, '../stubs', file));
              })
              .map(function (jsonPodcast) {
                return JSON.parse(jsonPodcast);
              })
              .map(Podcast.createFromJSON);
          }
        });
      }
    }
  });

  return Podcast;
};

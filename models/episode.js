'use strict';
var inspect = require('util').inspect;

module.exports = function (sequelize, DataTypes) {
  var Episode = sequelize.define('Episode', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    audioUrl: {
      type: DataTypes.STRING,
      allowNull: false
    },
    subtitle: DataTypes.TEXT,
    description: DataTypes.TEXT,
    showUrl: DataTypes.STRING,
    // imageUrl: DataTypes.STRING,
    guid: DataTypes.STRING,
    totalTime: DataTypes.INTEGER,
    publishedAt: DataTypes.DATE
  }, {
    classMethods: {
      associate: function (models) {
        Episode.belongsTo(models.Podcast, {foreignKey: 'podcastId'});
      },

      createFromJSON: function (json) {
        if (json.enclosures.length === 0) {
          log.warn("*** Skipping episode with no audio: ", json.title);
          return null;
        }
        var info = _.pick(json, ['title', 'subtitle', 'description', 'guid']);

        info.audioUrl = json.enclosures[0].url;
        info.showUrl = json.link;
        info.totalTime = json.total_time;
        info.publishedAt = new Date(json.published * 1000);

        // log.info("Creating episode with title: ", info.title);
        return Episode.create(info);
      }
    }
  });

  return Episode;
};

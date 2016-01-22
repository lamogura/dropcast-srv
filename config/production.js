'use strict';

var winston = require('winston');

if (process.env.DATABASE_URL) {
  console.log('HEROKU INSTANCE - connecting to heroku postgres');
}

var match = process.env.DATABASE_URL.match(/postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);

var winstonLogger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      level: 'debug',
      colorize: true
    }), new winston.transports.File({
      filename: '' + process.env.NODE_ENV + '.log'
    })
  ]
});

module.exports = {
  db: {
    name: match[5],
    username: match[1],
    password: match[2],
    options: {
      dialect: 'postgres',
      protocol: 'postgres',
      port: match[4],
      host: match[3],
      logging: false
    }
  },
  logger: winstonLogger
};

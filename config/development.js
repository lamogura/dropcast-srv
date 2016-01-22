'use strict';

var winston = require('winston');

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

var dbOptions = {};

if (process.env.DATABASE_URL) {
  winstonLogger.log('HEROKU INSTANCE - connecting to heroku postgres');
  var match = process.env.DATABASE_URL.match(/postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
  dbOptions = {
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
  };
} 
else {
  winstonLogger.log('LOCAL INSTANCE - connecting to local postgres');

  var isWin = /^win/.test(process.platform);
  var macUsername = isWin ? '' : process.env.HOME.split('/')[2];

  dbOptions = {
    name: 'dropcast-dev',
    username: isWin ? 'postgres' : macUsername,
    password: isWin ? 'justin' : '',
    options: {
      dialect: 'postgres',
      port: 5432,
      logging: false
    }
  };
}

module.exports = {
  db: dbOptions,
  port: 3000,
  logger: winstonLogger
};

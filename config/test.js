'use strict';

var winston = require('winston');

var isWin = /^win/.test(process.platform);

var macUsername = isWin ? '' : process.env.HOME.split('/')[2];

var dbOptions = {
  name: 'dropcast-test',
  username: isWin ? 'postgres' : macUsername,
  password: isWin ? 'justin' : '',
  options: {
    dialect: 'postgres',
    port: 5432,
    logging: function() {}
  }
};

module.exports = {
  db: dbOptions,
  port: 3000,
  logger: new winston.Logger({
    transports: [
      // new winston.transports.Console({
      //   level: 'debug',
      //   colorize: true
      // }),
      new winston.transports.File({
        filename: '' + process.env.NODE_ENV + '.log'
      })
    ]
  })
};

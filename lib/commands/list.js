var Promise = require('bluebird')
  , _ = require('lodash');

module.exports = (function () {

  return function (cli) {
    return new Promise(
        function (resolve, reject) {
          if (_.isEmpty(cli.sprout.templates)) {
            cli.emitter.emit('error', new Error('no templates exist!'));
          } else {
            cli.emitter.emit('list', _.keys(cli.sprout.templates));
          }
          return resolve();
        }
      )
  }

}.call(this));

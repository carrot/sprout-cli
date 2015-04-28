var Promise = require('bluebird')
  , _ = require('lodash');

module.exports = (function () {

  /*
   * List all templates.
   * @param {Function} cli - CLI instance.
   */

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

var W = require('when')
var _ = require('lodash')

/*
 * List all templates.
 * @param {Function} cli - CLI instance.
 */
module.exports = function (cli) {
  if (_.isEmpty(cli.sprout.templates)) {
    cli.emitter.emit('error', new Error('no templates exist!'))
  } else {
    cli.emitter.emit('list', _.keys(cli.sprout.templates))
  }
  return W.resolve()
}

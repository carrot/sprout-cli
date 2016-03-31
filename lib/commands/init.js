var helpers = require('./../helpers')
var path = require('path')
var _ = require('lodash')

/*
 * Initialize a template.
 * @param {Function} cli - CLI instance.
 * @param {Object} args - CLI arguments.
 */
module.exports = function (cli, args) {
  var name = args.name
  var target = path.resolve(cli.cwd, args.target)
  if (_.isArray(args.locals)) {
    args.locals = helpers.parseKeyValuesArray(args.locals)
  }
  if (args.configPath) {
    args.configPath = path.resolve(cli.cwd, args.configPath)
  }
  args.questionnaire = helpers.questionnaire
  return cli.sprout.init(name, target, helpers.stripExtras(_.omit(args, 'name', 'target'))).then(function () {
    return cli.emitter.emit('success', 'template `' + name + '` initialized at ' + target + '!')
  })
}

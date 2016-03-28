var helpers = require('./../helpers')
var path = require('path')

module.exports = (function () {
  /*
   * Add a template.
   * @param {Function} cli - CLI instance.
   * @param {Object} args - CLI arguments.
   */
  return function (cli, args) {
    var name = args.name
    var src = helpers.isGitUrl(args.src) ? args.src : path.resolve(cli.cwd, args.src)
    return cli.sprout.add(name, src).then(function () {
      return cli.emitter.emit('success', 'template `' + name + '` from ' + src + ' added!')
    })
  }
}.call(this))

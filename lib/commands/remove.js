/*
 * Remove a template.
 * @param {Function} cli - CLI instance.
 * @param {Object} args - CLI arguments.
 */
module.exports = function (cli, args) {
  var name = args.name
  return cli.sprout.remove(name).then(function () {
    return cli.emitter.emit('success', 'template `' + name + '` removed!')
  })
}

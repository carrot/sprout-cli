module.exports = (function () {

  /*
   * Run a generator on a template.
   * @param {Function} cli - CLI instance.
   * @param {Object} args - CLI arguments.
   */

  return function (cli, args) {
    var name = args.name
      , generator = args.generator
      , target = args.target ? path.resolve(cli.cwd, args.target) : cli.cwd;
    return cli.sprout.run(name, target, generator, args.args).then(
      function () {
        return cli.emitter.emit('success', 'template `' + name + '` ran generator `' + generator + '` at ' + target + '!');
      }
    )
  }

}.call(this));

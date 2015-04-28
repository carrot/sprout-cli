var helpers = require('./../helpers');

module.exports = (function () {

  /*
   * Add a template.
   * @param {Function} cli - CLI instance.
   * @param {Object} args - CLI arguments.
   */

  return function (cli, args) {
    var name = args.name
      , src = helpers.isGitURL(args.src) ? args.src : path.resolve(cli.cwd, args.src);
    return cli.sprout.add(name, src).then(
      function () {
        return cli.emitter.emit('success', 'template `' + name + '` from ' + src + ' added!');
      }
    );
  }

}.call(this));

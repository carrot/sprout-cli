var helpers = require('./../helpers')
  , path = require('path')
  , _ = require('lodash');

module.exports = (function () {

  return function (cli, args) {
    var name = args.name
      , target = path.resolve(cli.cwd, args.target);
    if (_.isArray(args.locals)) {
      args.locals = helpers.parseKeyValuesArray(args.locals);
    }
    if (args.config) {
      args.config = path.resolve(cli.cwd, args.config);
    }
    args.questionnaire = helpers.questionnaire;
    return cli.sprout.init(name, target, _.omit(args, 'name', 'target')).then(
      function () {
        return cli.emitter.emit('success', 'template `' + name + '` initialized at ' + target + '!');
      }
    );
  }

}.call(this));

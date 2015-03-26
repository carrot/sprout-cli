var helpers = require('./helpers')
  , Sprout = require('sprout')
  , Emitter = require('events').EventEmitter
  , chalk = require('chalk')
  , _ = require('lodash');

module.exports = (function () {

  var CLI = function (args) {
    var sprout = this.sprout = new Sprout(helpers.sproutPath());
    var emitter = this.emitter = new Emitter;

    this.cwd = process.cwd();

    emitter.on('success',
      function (message) {
        console.log(chalk.green('✓ ' + message.toString()));
      }
    )

    emitter.on('error',
      function (error) {
        console.error(chalk.red('✘ ' + error.toString()));
      }
    )

    emitter.on('list',
      function (list) {
        var item;
        for (var i=0; i<list.length; i++) {
          item = list[i];
          console.log(chalk.grey('- ' + item.toString()));
        }
      }
    )

    if (args.verbose) {

      sprout.emitter.on('msg',
        function (message) {
          console.log(chalk.grey('▸ ' + message.toString()));
        }
      )

      sprout.emitter.on('cmd',
        function (cmd, cwd) {
          console.log(chalk.grey('$ ' + cmd.toString() + (cwd ? ' (from ' + cwd + ')' : '')));
        }
      )

      delete args.verbose;

    }

    this.run = function () {
      var self = this
        , action = args.action;
      return (require('./commands/' + action))(this, _.omit(args, 'action')).catch(
        function (error) {
          return self.emitter.emit('error', error);
        }
      );
    }

  }

  return CLI;

}.call(this));

var helpers = require('./helpers')
var Sprout = require('sprout')
var Emitter = require('events').EventEmitter
var chalk = require('chalk')
var _ = require('lodash')

module.exports = (function () {
  /*
   * Given an `args` object, returns a
   * CLI instance.
   * @param {Object} args - Arguments sent from command line.
   * @return {Function} - CLI instance.
   */

  var CLI = function (cwd, options) {
    options = _.isObject(options) ? options : {}
    var sprout = this.sprout = new Sprout(helpers.sproutPath())
    var emitter = this.emitter = new Emitter()
    this.cwd = cwd

    /*
     * Attach events to the emitter.
     */

    emitter.on('success', function (message) {
      console.log(chalk.green('✓ ' + message.toString()))
    })

    emitter.on('error', function (error) {
      console.error(chalk.red('✘ ' + error.toString()))
    })

    emitter.on('list', function (list) {
      var item
      for (var i = 0; i < list.length; i++) {
        item = list[i]
        console.log(chalk.grey('- ' + item.toString()))
      }
    })

    if (options.verbose) {
      /*
       * If `verbose` flag is passed,
       * message the user about everything.
       * Everything. Everything. Everything.
       */
      emitter.on('msg', function (message) {
        console.log(chalk.grey('▸ ' + message.toString()))
      })

      sprout.on('msg', function (message) {
        emitter.emit('msg', message)
      })

      emitter.on('cmd', function (cmd, cwd) {
        console.log(chalk.grey('$ ' + cmd.toString() + (cwd ? ' (from ' + cwd + ')' : '')))
      })

      sprout.on('cmd', function (cmd, cwd) {
        emitter.emit('cmd', cmd, cwd)
      })
    }
  }

  CLI.prototype = {
    run: function (args) {
      var self = this
      var action = args.action

      /*
       * Run the external command
       * script with the passed
       * arguments.
       */
      return (require('./commands/' + action))(this, _.omit(args, 'action'))
        .catch(function (error) {
          return self.emitter.emit('error', error)
        }
      )
    }
  }

  return CLI
}.call(this))

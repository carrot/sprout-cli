var CLI = require('./../lib')
  , AddCommand = require('./../lib/commands/add')
  , InitCommand = require('./../lib/commands/init')
  , ListCommand = require('./../lib/commands/list')
  , RemoveCommand = require('./../lib/commands/remove')
  , RunCommand = require('./../lib/commands/run')
  , helpers = require('./../lib/helpers')
  , Sprout = require('sprout')
  , chai = require('chai')
  , fs = require('fs')
  , path = require('path')
  , rimraf = require('rimraf')
  , exec = require('child_process').exec
  , Promise = require('bluebird');

chai.should();

var fixturesPath = path.join(__dirname, 'fixtures');

describe('CLI',
  function () {

    it('should contain sprout instance',
      function (done) {
        var cli = new CLI(process.cwd());
        cli.sprout.should.be.instanceof(Sprout);
        return rimraf(cli.sprout.path, done);
      }
    )

    it('should contain event emitter',
      function (done) {
        var cli = new CLI(process.cwd());
        cli.emitter.should.be.instanceof(require('events').EventEmitter);
        return rimraf(cli.sprout.path, done);
      }
    )

    it('should have one `success` event listener',
      function (done) {
        var cli = new CLI(process.cwd());
        cli.emitter.listeners('success').length.should.eq(1);
        return rimraf(cli.sprout.path, done);
      }
    )

    it('should have one `error` event listener',
      function (done) {
        var cli = new CLI(process.cwd());
        cli.emitter.listeners('error').length.should.eq(1);
        return rimraf(cli.sprout.path, done);
      }
    )

    it('should have one `list` event listener',
      function (done) {
        var cli = new CLI(process.cwd());
        cli.emitter.listeners('list').length.should.eq(1);
        return rimraf(cli.sprout.path, done);
      }
    )

    it('should have one `msg` event listener if verbose is true',
      function (done) {
        var cli = new CLI(process.cwd(), {verbose: true});
        cli.emitter.listeners('msg').length.should.eq(1);
        return rimraf(cli.sprout.path, done);
      }
    )

    it('should have zero `msg` event listener if verbose is false',
      function (done) {
        var cli = new CLI(process.cwd(), {verbose: false});
        cli.emitter.listeners('msg').length.should.eq(0);
        return rimraf(cli.sprout.path, done);
      }
    )

    it('should have one `cmd` event listener if verbose is true',
      function (done) {
        var cli = new CLI(process.cwd(), {verbose: true});
        cli.emitter.listeners('cmd').length.should.eq(1);
        return rimraf(cli.sprout.path, done);
      }
    )

    it('should have zero `cmd` event listener if verbose is false',
      function (done) {
        var cli = new CLI(process.cwd(), {verbose: false});
        cli.emitter.listeners('cmd').length.should.eq(0);
        return rimraf(cli.sprout.path, done);
      }
    )

    describe('run',
      function () {

        it('should run a command successfully',
          function (done) {
            var cli = new CLI(process.cwd());
            cli.run({action: 'add', name: 'cli.run.success', src: 'https://github.com/carrot/sprout-test-template'}).then(
              function () {
                fs.existsSync(path.join(cli.sprout.path, 'cli.run.success')).should.be.true;
              }
            ).then(
              function () {
                return rimraf(cli.sprout.path, done);
              }
            )
          }
        )

        it('should emit an error if there is an error',
          function (done) {
            var cli = new CLI(process.cwd());
            cli.emitter.on('error',
              function (error) {
                return rimraf(cli.sprout.path, done);
              }
            )
            cli.run({action: 'add', name: 'cli.run.error', src: 'foobarbooasdfasdfasdf'});
          }
        )

        it('should emit `msg` event if verbose',
          function (done) {
            var cli = new CLI(process.cwd(), {verbose: true});
            cli.emitter.on('msg',
              function () {
                return rimraf(cli.sprout.path, done);
              }
            )
            cli.run({action: 'add', name: 'cli.run.msg', src: 'https://github.com/carrot/sprout-test-template'}).then(
              function () {
                return cli.run({action: 'remove', name: 'cli.run.msg'});
              }
            );
          }
        )

        it('should emit `cmd` event if verbose',
          function (done) {
            var cli = new CLI(process.cwd(), {verbose: true});
            cli.emitter.on('cmd',
              function () {
                return rimraf(cli.sprout.path, done);
              }
            )
            cli.run({action: 'add', name: 'cli.run.cmd', src: 'https://github.com/carrot/sprout-test-template'});
          }
        )

      }
    )

  }
)

describe('commands',
  function () {

    var commandsFixturesPath;

    before(
      function () {
        commandsFixturesPath = path.join(fixturesPath, 'commands');
      }
    )

    describe('add',
      function () {

        var commandsAddFixturesPath;

        before(
          function () {
            commandsAddFixturesPath = path.join(commandsFixturesPath, 'add');
          }
        )

        it('should add a git template',
          function (done) {
            var cli = new CLI(process.cwd());
            return AddCommand(cli, {name: 'commands.add.git', src: 'https://github.com/carrot/sprout-test-template'}).then(
              function () {
                fs.existsSync(path.join(cli.sprout.path, 'commands.add.git')).should.be.true;
              }
            ).then(
              function () {
                return rimraf(cli.sprout.path, done);
              }
            )
          }
        )

        it('should add a local template',
          function (done) {
            var cli = new CLI(process.cwd())
              , fixture = path.join(commandsAddFixturesPath, 'local');
            return gitInit(fixture).then(
              function () {
                return AddCommand(cli, {name: 'commands.add.local', src: fixture});
              }
            ).then(
              function () {
                fs.existsSync(path.join(cli.sprout.path, 'commands.add.local')).should.be.true;
              }
            ).then(
              function () {
                return rimraf(cli.sprout.path, done);
              }
            )
          }
        )

      }
    )

    describe('init',
      function () {

        var commandsInitFixturesPath;

        before(
          function () {
            commandsInitFixturesPath = path.join(commandsFixturesPath, 'init');
          }
        )

        it('should init a template',
          function (done) {
            var cli = new CLI(process.cwd())
              , fixture = path.join(commandsInitFixturesPath, 'init')
              , src = path.join(fixture, 'src')
              , target = path.join(fixture, 'target');
            return gitInit(src).then(
              function () {
                return AddCommand(cli, {name: 'commands.init.init', src: src});
              }
            ).then(
              function () {
                return InitCommand(cli, {name: 'commands.init.init', target: target});
              }
            ).then(
              function () {
                fs.existsSync(target).should.be.true;
                return rimraf(cli.sprout.path,
                  function () {
                    return rimraf(target, done);
                  }
                );
              }
            )
          }
        )

        it('should parse locals passed to init',
          function (done) {
            var cli = new CLI(process.cwd())
              , fixture = path.join(commandsInitFixturesPath, 'locals')
              , src = path.join(fixture, 'src')
              , target = path.join(fixture, 'target');
            return gitInit(src).then(
              function () {
                return AddCommand(cli, {name: 'commands.init.locals', src: src});
              }
            ).then(
              function () {
                return InitCommand(cli, {name: 'commands.init.locals', target: target, locals: ['foo=bar', 'bar=foo']});
              }
            ).then(
              function () {
                fs.readFileSync(path.join(target, 'foo'), 'utf8').should.eq('barfoo\n');
                return rimraf(cli.sprout.path,
                  function () {
                    return rimraf(target, done);
                  }
                );
              }
            )
          }
        )

        it('should send config file to init',
          function (done) {
            var cli = new CLI(process.cwd())
              , fixture = path.join(commandsInitFixturesPath, 'config')
              , src = path.join(fixture, 'src')
              , target = path.join(fixture, 'target');
            return gitInit(src).then(
              function () {
                return AddCommand(cli, {name: 'commands.init.config', src: src});
              }
            ).then(
              function () {
                return InitCommand(cli, {name: 'commands.init.config', target: target, config: path.join(fixture, 'config.json')});
              }
            ).then(
              function () {
                fs.readFileSync(path.join(target, 'foo'), 'utf8').should.eq('bar\n');
                return rimraf(cli.sprout.path,
                  function () {
                    return rimraf(target, done);
                  }
                );
              }
            )
          }
        )

      }
    )

    describe('list',
      function () {
        it('should list templates',
          function (done) {
            var cli = new CLI(process.cwd());
            cli.emitter.on('list',
              function (arr) {
                arr.should.include('commands.list');
                rimraf(cli.sprout.path, done);
              }
            );
            AddCommand(cli, {name: 'commands.list', src: 'https://github.com/carrot/sprout-test-template'}).then(
              function () {
                return ListCommand(cli);
              }
            )
          }
        )
        it('should emit error if empty',
          function (done) {
            var cli = new CLI(process.cwd());
            cli.emitter.on('error',
              function (err) {
                err.toString().should.eq('Error: no templates exist!')
                rimraf(cli.sprout.path, done);
              }
            );
            return ListCommand(cli);
          }
        )
      }
    )

    describe('remove',
      function () {

        it('should remove a template',
          function (done) {
            var cli = new CLI(process.cwd());
            AddCommand(cli, {name: 'command.remove', src: 'https://github.com/carrot/sprout-test-template'}).then(
              function () {
                return RemoveCommand(cli, {name: 'command.remove'});
              }
            ).then(
              function () {
                fs.existsSync(path.join(cli.sprout.path, 'foo')).should.be.false;
                return rimraf(cli.sprout.path, done);
              }
            )
          }
        )

      }
    )

    describe('run',
      function () {

        var commandsRunFixturesPath;

        before(
          function () {
            commandsRunFixturesPath = path.join(commandsFixturesPath, 'run');
          }
        )

        it('should run a generator',
          function (done) {
            var cli = new CLI(process.cwd())
              , fixture = path.join(commandsRunFixturesPath, 'run')
              , src = path.join(fixture, 'src')
              , target = path.join(fixture, 'target');
            return gitInit(src).then(
              function () {
                return AddCommand(cli, {name: 'commands.run.run', src: src});
              }
            ).then(
              function () {
                return InitCommand(cli, {name: 'commands.run.run', target: target});
              }
            ).then(
              function () {
                return RunCommand(cli, {name: 'commands.run.run', target: target, generator: 'foo'});
              }
            ).then(
              function () {
                fs.readFileSync(path.join(target, 'foo'), 'utf8').should.eq('bar');
                return rimraf(target,
                  function () {
                    return rimraf(cli.sprout.path, done);
                  }
                )
              }
            )
          }
        )

        it('should use cwd if no target passed',
          function (done) {
            var fixture = path.join(commandsRunFixturesPath, 'run')
              , src = path.join(fixture, 'src')
              , target = path.join(fixture, 'target')
              , cli = new CLI(target);
            return gitInit(src).then(
              function () {
                return AddCommand(cli, {name: 'commands.run.cwd', src: src});
              }
            ).then(
              function () {
                return InitCommand(cli, {name: 'commands.run.cwd', target: target});
              }
            ).then(
              function () {
                return RunCommand(cli, {name: 'commands.run.cwd', generator: 'foo'});
              }
            ).then(
              function () {
                fs.readFileSync(path.join(target, 'foo'), 'utf8').should.eq('bar');
                return rimraf(target,
                  function () {
                    return rimraf(cli.sprout.path, done);
                  }
                )
              }
            )
          }
        )

      }
    )

  }
)

describe('helpers',
  function () {

    describe('isGitURL',
      function () {

        it('should determine is git url',
          function (done) {
            helpers.isGitURL('git@github.com:foo/bar').should.be.true;
            done();
          }
        )

        it('should determine is not git url',
          function (done) {
            helpers.isGitURL('asdfadsfasdf').should.be.false;
            done();
          }
        )

      }
    )

    describe('parseKeyValuesArray',
      function () {

        it('should return object',
          function (done) {
            var obj = helpers.parseKeyValuesArray(['foo=bar', 'foo2=bar2']);
            obj['foo'].should.eq('bar');
            obj['foo2'].should.eq('bar2');
            done();
          }
        )

        it('should skip if there is a missing key or value',
          function (done) {
            var obj = helpers.parseKeyValuesArray(['foo', 'foo2=bar2']);
            (obj['foo'] === undefined).should.be.true;
            obj['foo2'].should.eq('bar2');
            done();
          }
        )

        it('should return true bool if \'true\' is passed',
          function (done) {
            var obj = helpers.parseKeyValuesArray(['foo=true']);
            obj['foo'].should.be.true;
            done();
          }
        )

        it('should return false bool if \'false\' is passed',
          function (done) {
            var obj = helpers.parseKeyValuesArray(['foo=false']);
            obj['foo'].should.be.false;
            done();
          }
        )

        it('should return number if number as string is passed is passed',
          function (done) {
            var obj = helpers.parseKeyValuesArray(['foo=2']);
            obj['foo'].should.eq(2);
            done();
          }
        )

      }
    )

  }
)

/*
 * Helper function for initializing a git repository
 * in the specified directory.
 * @param {String} dir - directory to create repo in.
 */

 var gitInit = function (dir) {
   return Promise.promisify(exec)('git init .', { cwd: dir });
 }

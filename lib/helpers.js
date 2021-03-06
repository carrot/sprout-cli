var path = require('path')
var fs = require('fs')
var mkdirp = require('mkdirp')
var os = require('os')
var osenv = require('osenv')
var crypto = require('crypto')
var inquirer = require('inquirer')
var _ = require('lodash')

/* A public helper function for determining a Sprout path.
 * @returns {String} - a path for Sprout.
 */

exports.sproutPath = function () {
  var sproutPath = process.env.SPROUT_PATH
  if (!sproutPath) {
    sproutPath = userSproutPath()
    if (!fs.existsSync(sproutPath)) {
      mkdirp.sync(sproutPath)
    }
  }
  return sproutPath
}

/*
 * Determines whether a string is a
 * valid Git URL tests against a
 * regular expression.
 * @param {String} str - String to test
 * @return {Boolean} - is `str` a git URL
 */

exports.isGitUrl = function (str) {
  return /(?:[A-Za-z0-9]+@|https?:\/\/)[A-Za-z0-9.]+(?::|\/)[A-Za-z0-9/]+(?:\.git)?/.test(str)
}

/*
 * Parse an array of key/value pairs delimited
 * with `=` (i.e. `foo=bar`) into an object.
 * @param {Array} arr - Array to parse
 * @return {Object} - resulting object.
 */

exports.parseKeyValuesArray = function (arr) {
  var kV
  return _.reduce(arr,
    function (memo, keyValue) {
      kV = keyValue.split('=')
      if (kV.length === 2) {
        if (kV[1] === 'true') {
          kV[1] = true
        } else if (kV[1] === 'false') {
          kV[1] = false
        } else if (!isNaN(kV[1])) {
          kV[1] = parseFloat(kV[1])
        }
        memo[kV[0]] = kV[1]
      }
      return memo
    }, {}
  )
}

/*
 * A helper function for calling Inquirer.
 * Passed to `cli.init` to be called when
 * `template.init` would like answers.
 * @param {Array} questions - questions to inquire about.
 * @param {Array} skip - names of questions to skip.
 * @returns {Promise} - a promise with the answers.
 */

exports.questionnaire = inquirer.prompt.bind(inquirer)

/**
 * Strips any null values or setters that argparse adds to the args object
 * @param  {Object} obj args from argparse
 * @return {Object}     sanitized args object
 */
exports.stripExtras = function (obj) {
  return _.reduce(obj, function (m, v, k) {
    if (v && ['isset', 'set', 'get', 'unset'].indexOf(k) < 0) { m[k] = v }
    return m
  }, {})
}

/* A private helper function for determining a
 * path in the current user folder for Sprout.
 * @returns {String} - a user path for Sprout.
 */

var userSproutPath = function () {
  var user = (osenv.user() || generateFakeUser()).replace(/\\/g, '-')
  var tmp = path.join((os.tmpdir ? os.tmpdir() : os.tmpDir()), user)
  return path.join((osenv.home() || tmp), '.config', 'sprout')
}

/*
 * A private helper function for generating a fake
 * user where necessary, used to create a
 * user Sprout path.
 * @returns {String} - a fake user string.
 */

var generateFakeUser = function () {
  var uid = [process.pid, Date.now(), Math.floor(Math.random() * 10000000)].join('-')
  return crypto
    .createHash('md5')
    .update(uid)
    .digest('hex')
}

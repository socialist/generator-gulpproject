'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-generator').test;

describe('generator-gulpproject:app', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withOptions(
      {
        coffee: true,
        sass: 'compass'
      }
      )
      .withPrompts(
      {
        appName: 'Application'
      }
      )
      .on('end', done);
  });

  it('creates files', function () {
    assert.file([
      '.bowerrc',
      'gslint.conf',
      '.gitignore',
      'src/scss/main.scss',
      'src/scss/_variables.scss',
      'src/scss/_mixins.scss',
      'Gulpfile.js',
      'package.json',
      'bower.json'
    ]);
  });
});

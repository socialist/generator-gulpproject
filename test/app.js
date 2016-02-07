'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');

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

  it('write to main.scss', function () {
    assert.fileContent('src/scss/main.scss', '@import "variables";\n@import "mixins";\n\n');
  });
});

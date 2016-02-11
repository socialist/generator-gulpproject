'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var mkdirp = require('mkdirp');

module.exports = yeoman.Base.extend({
  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the wonderful ' + chalk.red('generator-gulpproject') + ' generator!'
    ));

    var prompts = [
      {
        type: 'prompt',
        name: 'appName',
        message: 'Название проекта',
        default: this.appname
      },
      {
        name: 'description',
        message: 'Краткое описание проекта'
      },
      {
        type: 'list',
        name: 'framework',
        message: 'Какой фреймворк будем использовать?',
        choices: [
          {
            name: 'Foundation 5',
            value: 'foundation5'
          },
          {
            name: 'Foundation 6',
            value: 'foundation6'
          },
          {
            name: 'Bootstrap 3',
            value: 'bootstrap3'
          },
          {
            name: 'Bootstrap 4',
            value: 'bootstrap4'
          },
          {
            name: 'Flat UI',
            value: 'flatui'
          },
          {
            name: 'Materialize',
            value: 'materialize'
          },
          {
            name: 'Material-UI',
            value: 'materialui'
          },
          {
            name: 'Susy',
            value: 'susy'
          },
          {
            name: 'Не использовать фреймворки',
            value: 'none'
          }
        ],
        default: 0
      },
      {
        type: 'list',
        name: 'sass',
        message: 'Какой css-препроцессор будем использовать?',
        choices: [
          {
            name: 'sass',
            value: 'sass'
          },
          {
            name: 'Compass',
            value: 'compass'
          }
        ],
        default: 1
      },
      {
        type: 'checkbox',
        name: 'features',
        message: 'Выбери дополнительные компоненты',
        choices: [
          {
            name: 'Modernizer',
            value: 'modernizer'
          },
          {
            name: 'Autoprefixer',
            value: 'autoprefixer'
          }
        ],
        default: []
      },
      {
        type: 'confirm',
        name: 'coffee',
        message: 'Будем использовать CoffeeScript?',
        default: true
      },
      {
        type: 'confirm',
        name: 'jade',
        message: 'Будем использовать JADE?',
        default: true
      }
    ];

    this.prompt(prompts, function (props) {
      // this.props = props;
      // To access props later use this.props.someOption;

      function hasFeature(feat) {
        return props.features.indexOf(feat) !== -1;
      }

      this.appName = props.appName;
      this.description = props.description;
      this.framework = props.framework;
      this.sass = props.sass;
      this.modernizer = hasFeature('modernizer');
      this.autoprefixer = hasFeature('autoprefixer');
      this.coffee = props.coffee;
      this.jade = props.jade;

      done();
    }.bind(this));
  },

  writing: function () {
    var callback = function (err) {
      return err;
    };

    mkdirp('src', callback);
    mkdirp('src/scss', callback);
    mkdirp('src/scss/variables', callback);
    mkdirp('src/scss/mixins', callback);
    mkdirp('src/images', callback);

    if (this.jade) {
      mkdirp('src/templates', callback);
      mkdirp('src/templates/includes', callback);
      mkdirp('src/templates/includes/mixins', callback);

      this.write('src/templates/includes/mixins/_mixins.jade', '');
      this.write('src/templates/includes/_head.jade',
        'doctype html\nhtml\n\thead\n\t\t' +
        'meta(charset="utf-8")\n\t\t' +
        'meta(name="viewport", content="width=device-width, initial-scale=1.0", maximum-scale=1.0, user-scalable=no)\n\t\t' +
        'title Title\n\tbody\n\t\th1 Header');
      this.write('src/templates/includes/_footer.jade', '');
      this.write('src/templates/index.jade', 'include ./includes/_head');
    }

    if (this.coffee === true) {
      mkdirp('src/coffee', callback);
    }

    this.fs.copy(
        this.templatePath('_.bowerrc'),
        this.destinationPath('.bowerrc')
    );

    this.fs.copy(
      this.templatePath('_.eslintrc'),
      this.destinationPath('.eslintrc')
    );

    this.fs.copy(
      this.templatePath('_.jscsrc'),
      this.destinationPath('.jscsrc')
    );

    this.fs.copy(
        this.templatePath('_gslint.conf'),
        this.destinationPath('gslint.conf')
    );

    this.fs.copy(
        this.templatePath('_.gitignore'),
        this.destinationPath('.gitignore')
    );

    if (this.sass === 'compass') {
      this.fs.copy(
          this.templatePath('_config.rb'),
          this.destinationPath('config.rb')
      );

      if (this.framework === 'susy') {
        this.fs.copy(
          this.templatePath('sass/_susy_grid.scss'),
          this.destinationPath('src/scss/_grid.scss')
        );
      }
    }

    this.template('_Gulpfile', 'Gulpfile.js');
    this.template('_package.json', 'package.json');
    this.template('_bower.json', 'bower.json');

    this.write('src/scss/main.scss', '@import "variables";\n@import "mixins";\n\n');
    this.write('src/scss/_variables.scss', '');
    this.write('src/scss/_mixins.scss', '');
    if (this.coffee) {
      this.write('src/coffee/app.coffee', '');
    }
  },

  install: function () {
    this.installDependencies();
  }
});

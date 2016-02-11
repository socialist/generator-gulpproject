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
        type: 'checkbox',
        name: 'iconfont',
        message: 'Будем использовать какие-то иконки?',
        choices: [
          {
            name: 'Font Awesome',
            value: 'fa'
          },
          {
            name: 'Ion Icons',
            value: 'ion'
          }
        ],
        default: []
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

      function hasFont(feat) {
        return props.iconfont.indexOf(feat) !== -1;
      }

      this.appName = props.appName;
      this.description = props.description;
      this.framework = props.framework;
      this.sass = props.sass;
      this.modernizer = hasFeature('modernizer');
      this.autoprefixer = hasFeature('autoprefixer');
      this.fa = hasFont('fa');
      this.ion = hasFont('ion');
      this.coffee = props.coffee;
      this.jade = props.jade;

      done();
    }.bind(this));
  },

  writing: function () {
    var scssMixins = '';
    var scssVariables = '';
    var scssIncludes;
    var _this = this;
    var callback = function (err) {
      return err;
    };
    var copyMixin = function () {
      _this.fs.copy(
        _this.templatePath('sass/mixins/_icon-fonts.scss'),
        _this.destinationPath('src/scss/mixins/_icon-fonts.scss')
      );
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
      mkdirp('src/data', callback);

      this.write('src/templates/includes/mixins/_mixins.jade', '');
      this.write('src/templates/includes/_head.jade',
        'doctype html\nhtml\n\thead\n\t\t' +
        'meta(charset="utf-8")\n\t\t' +
        'meta(name="viewport", content="width=device-width, initial-scale=1.0", maximum-scale=1.0, user-scalable=no)\n\t\t' +
        'title=title\n\t\tlink(rel="stylesheet", href="/css/main.css")');
      this.write('src/templates/includes/_footer.jade', '');
      this.write('src/templates/index.jade', 'include ./includes/_head\nbody\n\th1=header');
      this.write('src/data/index.json', '{\n\t"title": "First awesome step",\n\t"header": "First awesome step"\n}');
    }

    // Fonts
    if (this.fa === true) {
      copyMixin();

      this.fs.copy(
        this.templatePath('sass/variables/_font-awesome.scss'),
        this.destinationPath('src/scss/variables/_font-awesome.scss')
      );
      this.fs.copy(
        this.templatePath('sass/_font-awesome.scss'),
        this.destinationPath('src/scss/_font-awesome.scss')
      );
    }
    if (this.ion === true) {
      copyMixin();

      this.fs.copy(
        this.templatePath('sass/variables/_ionicons.scss'),
        this.destinationPath('src/scss/variables/_ionicons.scss')
      );
      this.fs.copy(
        this.templatePath('sass/_ionicons.scss'),
        this.destinationPath('src/scss/_ionicons.scss')
      );
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

    // SCSS Files
    scssIncludes = '@import "variables";\n@import "mixins";\n\n';
    if (this.framework === 'susy') {
      scssIncludes += '@import "grid";\n\n';
    }
    if (this.fa === true || this.ion === true) {
      scssMixins += '@import "mixins/icon-fonts";\n';
    }
    if (this.fa === true) {
      scssIncludes += '@import "font-awesome";\n';
      scssVariables += '@import "variables/font-awesome";\n';
    }
    if (this.ion === true) {
      scssIncludes += '@import "ionicons";\n';
      scssVariables += '@import "variables/ionicons";\n';
    }
    this.write('src/scss/main.scss', scssIncludes);
    this.write('src/scss/_variables.scss', scssVariables);
    this.write('src/scss/_mixins.scss', scssMixins);
    if (this.coffee) {
      this.write('src/coffee/app.coffee', '');
    }
  },

  install: function () {
    this.installDependencies();
  }
});

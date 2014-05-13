'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');


var PolyprojectGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require('../package.json');

    this.on('end', function () {
      if (!this.options['skip-install']) {
        this.installDependencies({});
      }
    });
  },

  askFor: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay('Welcome to the marvelous Polyproject generator!'));

    var prompts = [
      {
        name: 'projectName',
        message: 'What is the name of the project?',
        default: "project"
      }
    ];

    this.prompt(prompts, function (props) {
      this.projectName = props.projectName;

      done();
    }.bind(this));
  },

  app: function () {
    this.mkdir('mockups');
    this.mkdir('static');
    this._processDirectory('assets', 'static/assets');

    /*
     this.mkdir('static/assets');
     this.mkdir('static/assets/css');
     this.mkdir('static/assets/images');
     this.mkdir('static/assets/js');
     this.mkdir('static/assets/libs');
     this.mkdir('static/assets/sass');
     */

    this._processDirectory('templates', 'static/templates');
    /*
     this.mkdir('static/templates');
     this.mkdir('static/templates/_data');
     this.mkdir('static/templates/_helpers');
     this.mkdir('static/templates/_includes');
     this.mkdir('static/templates/_layouts');
     this.mkdir('static/templates/_pages');
     */
    this.copy('_package.json', 'package.json');
    this.copy('_bower.json', 'bower.json');
    this.copy('Gruntfile.js', 'Gruntfile.js');
  },

  hiddenfiles: function () {
    this.copy('_bowerrc', '.bowerrc');
    this.copy('_gitignore', '.gitignore');
    this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');
  },
  _processDirectory: function (source, destination) {
    var root = this.isPathAbsolute(source) ? source : path.join(this.sourceRoot(), source);
    var files = this.expandFiles('**', { dot: true, cwd: root });

    for (var i = 0; i < files.length; i++) {
      var f = files[i];
      var src = path.join(root, f);
      if (path.basename(f).indexOf('_') == 0) {
        var dest = path.join(destination, path.dirname(f), path.basename(f).replace(/^_/, ''));
        this.template(src, dest);
      }
      else {
        var dest = path.join(destination, f);
        this.copy(src, dest);
      }
    }
  }
});

module.exports = PolyprojectGenerator;

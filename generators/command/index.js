'use strict';
// var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var path = require('path');

var AppGenerator = require('../app');

module.exports = AppGenerator.extend({
  initializing: function () {
    this.showInfo();
    this.log(
        'Running ' + chalk.red('COMMAND') + ' generator!'
    );
  },
  prompting: function () {
    var prompts = this.requiredSettings();

    return this.prompt(prompts).then(function (props) {
      props.dependencies = props.dependencies.toString().match(/[^ ]+/g) || [];
      if (props.dependencies.length > 0) {
        props.dependencies.unshift('');
      }

      props.dependenciesString = props.dependencies.map(i => '\'' + i + '\'') || [];
      props.dependenciesString.shift();
      props.dependenciesString.push('');

      props.explanations = this.getPluginsExplanations();
      this.props = props;
    }.bind(this));
  },

  writing: function () {
    this.destinationRoot(path.join(this.destinationRoot(), '/' + this.props.pluginname));
    var pluginCommandFilename = this.props.pluginname + 'PluginCommand.js';
    this.fs.copyTpl(
        this.templatePath('PluginCommandTemplate.js'),
        this.destinationPath(pluginCommandFilename), {props: this.props}
    );
    this.log(chalk.green('Written file: ' + pluginCommandFilename));
  },

  // install: function () {
  //   this.log(
  //       'Install in command generator'
  //   );
  //   this.installDependencies();
  // }
});

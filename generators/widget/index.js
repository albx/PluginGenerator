'use strict';

// var yeoman = require('yeoman-generator');
var chalk = require('chalk');
// var yosay = require('yosay');
var path = require('path');

var AppGenerator = require('../app');

module.exports = AppGenerator.extend({

  initializing: function () {
    this.showInfo();
    this.log(
        'Running ' + chalk.red('WIDGET') + ' generator!'
    );
  },

  prompting: function () {
    var prompts = this.requiredSettings({exclude: ['requireRefresh']});
    return this.prompt(prompts).then(function (props) {
      props.folderName = this.appname;
      props.plugindirective = props.pluginname + 'Directive';

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
    // Copio la factory che conterra' i riferimenti agli asset statici del plugin rotta e che mi permette di recuperarli.
    var factoryRouteFilename = this.props.pluginname + '.js';
    var pageRouteFilename = this.props.pluginname + '.html';
    var directiveFilename = this.props.plugindirective + '.js';
    var styleRouteFilename = this.props.pluginname + '.css';

    this.fs.copyTpl(
        this.templatePath('PluginWidgetTemplate.js'),
        this.destinationPath(factoryRouteFilename), {props: this.props}
    );
    this.log(chalk.green('Written file: ' + factoryRouteFilename));
    // Copio l'html
    this.fs.copyTpl(
        this.templatePath('PluginWidgetTemplate.html'),
        this.destinationPath(pageRouteFilename), {props: this.props}
    );
    this.log(chalk.green('Written file: ' + pageRouteFilename));

    // Copio il controller
    this.fs.copyTpl(
        this.templatePath('PluginWidgetTemplateDirective.js'),
        this.destinationPath(directiveFilename), {props: this.props}
    );
    this.log(chalk.green('Written file: ' + directiveFilename));

    // Copio il css
    this.fs.copyTpl(
        this.templatePath('PluginWidgetTemplate.css'),
        this.destinationPath(styleRouteFilename), {props: this.props}
    );
    this.log(chalk.green('Written file: ' + styleRouteFilename));
  }
});

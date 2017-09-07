const Generator = require('yeoman-generator');
const mkdirp = require('mkdirp');
const fs = require('fs');
const open = require('open');
const S = require('string');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.option('title', {
      type: String,
      required: true,
      desc: 'Project title',
    });
  }

  prompting() {
    const questions = [ {
      type: 'confirm',
      name: 'archie',
      message: 'Would you like to include an ArchieML configuration?',
      default: false,
    }];

    return this.prompt(questions).then((answers) => {
      this.archie = answers.archie;
    });
  }

  template() {
    this.composeWith('politico-interactives:bundler-webpack', {
      archie: this.archie,
    });
    if (this.archie) {
      this.composeWith('politico-interactives:archie');
    }
  }

  writing() {
    this.slug = S(this.options.title).slugify().s;
    // Skeleton
    mkdirp('./src');
    mkdirp('./dist');
    mkdirp('./server')
    // Nunjucks templates
    this.fs.copyTpl(
      this.templatePath('src/templates/embed.html'),
      this.destinationPath('src/templates/embed.html'),
      { slug: this.slug });
    this.fs.copyTpl(
      this.templatePath('src/templates/index.html'),
      this.destinationPath('src/templates/index.html'),
      { title: this.options.title });
    this.fs.copyTpl(
      this.templatePath('src/templates/base.html'),
      this.destinationPath('src/templates/base.html'));
    // Template context
    this.fs.writeJSON('src/data/data.json', {});
    this.fs.copy(
      this.templatePath('server/router.js'),
      this.destinationPath('server/router.js'));
    // Images directory
    mkdirp('./src/images');
    mkdirp('./dist/images');
    // Javascript
    this.fs.copy(
      this.templatePath('src/js/main-app.js'),
      this.destinationPath('src/js/main-app.js'));
  }

  install() {
    const dependencies = [
      'pym.js',
    ];
    this.yarnInstall(dependencies, { save: true });
  }

  end() {
    this.spawnCommand('gulp')
  }
};

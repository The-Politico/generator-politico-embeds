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

    this.BROWSERIFY = 'browserify';
    this.WEBPACK = 'webpack';
  }

  prompting() {
    const questions = [{
      type: 'list',
      name: 'bundler',
      message: 'Which module bundler would you like to use?',
      default: this.BROWSERIFY,
      choices: [
        {
          name: 'Browserify (default)',
          value: this.BROWSERIFY,
        },
        {
          name: 'Webpack (ES2015 + SCSS)',
          value: this.WEBPACK,
        },
      ],
    }, {
      type: 'confirm',
      name: 'archie',
      message: 'Would you like to include an ArchieML configuration?',
      default: false,
    }];

    return this.prompt(questions).then((answers) => {
      this.webpack = answers.bundler === this.WEBPACK;
      this.archie = answers.archie;
    });
  }

  template() {
    if (this.webpack) {
      this.composeWith('politico-interactives:bundler-webpack', {
        archie: this.archie,
      });
    } else {
      this.composeWith('politico-interactives:bundler-browserify', {
        archie: this.archie,
      });
    }
    if (this.archie) {
      this.composeWith('politico-interactives:archie');
    }
  }

  writing() {
    this.slug = S(this.options.title).slugify().s;
    // Skeleton
    mkdirp('./src');
    mkdirp('./dist');
    // Nunjucks templates
    this.fs.copyTpl(
      this.templatePath('dist/embed.html'),
      this.destinationPath('dist/embed.html'),
      { slug: this.slug });
    this.fs.copyTpl(
      this.templatePath('src/templates/index.html'),
      this.destinationPath('src/templates/index.html'),
      { title: this.options.title });
    this.fs.copyTpl(
      this.templatePath('src/templates/base.html'),
      this.destinationPath('src/templates/base.html'),
      { webpack: this.webpack });
    // Template context
    this.fs.writeJSON('src/templates/data.json', {});
    // Images directory
    mkdirp('./src/images/opt');
    mkdirp('./dist/images');
    // Javascript
    this.fs.copy(
      this.templatePath('src/js/main.js'),
      this.destinationPath('src/js/main.js'));
  }

  install() {
    const dependencies = [
      'pym.js',
    ];
    this.yarnInstall(dependencies, { save: true });
  }

  end() {
    const nunjucksTask = this.spawnCommand('gulp', ['nunjucks']);
    nunjucksTask.on('close', () => {
      // Copy the rendered template over initially
      if (this.webpack) {
        fs.createReadStream('./src/index.html').pipe(fs.createWriteStream('./dist/index.html'));
      }

      const imgTask = this.spawnCommand('gulp', ['img']);
      imgTask.on('close', () => {
        // Need this for webpack. Investigating why...
        const yarnTask = this.spawnCommand('yarn', ['install']);
        yarnTask.on('close', () => {
          this.spawnCommand('gulp');
          open('http://localhost:3000/embed.html');
        });
      });
    });
  }
};

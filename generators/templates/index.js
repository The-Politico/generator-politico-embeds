const Generator = require('yeoman-generator');
const mkdirp = require('mkdirp');
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
    const questions = [
      {
        type: 'confirm',
        name: 'archie',
        message: 'Would you like to include an ArchieML configuration?',
        default: false,
      },
      {
        type: 'confirm',
        name: 'spreadsheet',
        message: 'Would you like Google Spreadsheet integration?',
        default: false,
      },
    ];

    return this.prompt(questions).then((answers) => {
      this.archie = answers.archie;
      this.spreadsheet = answers.spreadsheet;
    });
  }

  template() {
    this.composeWith('politico-interactives:bundler-webpack', {
      archie: this.archie,
    });
    this.composeWith(require.resolve('../gulp-statics'));
    if (this.archie) {
      this.composeWith('politico-interactives:archie');
    }
    if (this.spreadsheet) {
      this.composeWith('politico-interactives:spreadsheet');
    }
  }

  writing() {
    this.slug = S(this.options.title).slugify().s;
    // Skeleton
    mkdirp('./src');
    mkdirp('./dist');
    mkdirp('./server');

    this.fs.copyTpl(
      this.templatePath('gulpfile.js'),
      this.destinationPath('gulpfile.js'),
      { archie: this.archie,
        spreadsheet: this.spreadsheet,
      });
    // Nunjucks templates
    this.fs.copyTpl(
      this.templatePath('src/templates/_preview.html'),
      this.destinationPath('src/templates/_preview.html'),
      { slug: this.slug });
    this.fs.copy(
      this.templatePath('src/templates/index.html'),
      this.destinationPath('src/templates/index.html'));
    this.fs.copyTpl(
      this.templatePath('src/templates/_base.html'),
      this.destinationPath('src/templates/_base.html'));
    this.fs.copyTpl(
      this.templatePath('src/templates/graphics/graphic.html'),
      this.destinationPath('src/templates/graphics/graphic.html'),
      { title: this.title });
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

    const devDependencies = [
      'gulp-env',
      'node-env-file',
      'run-sequence',
      'secure-keys',
    ];
    this.yarnInstall(devDependencies, { dev: true });
  }

  end() {
    this.spawnCommand('gulp');
  }
};

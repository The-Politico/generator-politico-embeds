const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  writing() {
    this.fs.copy(
      this.templatePath('gulp/tasks/html.js'),
      this.destinationPath('gulp/tasks/html.js'));
    this.fs.copy(
      this.templatePath('gulp/tasks/embeds.js'),
      this.destinationPath('gulp/tasks/embeds.js'));
  }

  installing() {
    const dependencies = [
      'gulp-tap',
    ];

    this.yarnInstall(dependencies, { dev: true });
  }
};

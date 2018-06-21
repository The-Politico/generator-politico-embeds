const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  writing() {
    this.fs.copy(
      this.templatePath('src/ai/_ai2html-template.ai'),
      this.destinationPath('src/ai/_ai2html-template.ai'));
    this.fs.copy(
      this.templatePath('src/ai/config.yml'),
      this.destinationPath('src/ai/config.yml'));
    this.fs.copy(
      this.templatePath('src/templates/_ai2html-resizer.html'),
      this.destinationPath('src/templates/_ai2html-resizer.html'));
  }
};

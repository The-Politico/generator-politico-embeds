const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  prompting() {
    const prompts = [{
      name: 'viewSlug',
      message: 'What is the slug of your new embed?',
    }];

    return this.prompt(prompts).then((answers) => {
      this.viewSlug = answers.viewSlug;
    });
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('graphic.html'),
      this.destinationPath(`src/templates/graphics/${this.viewSlug}.html`),
      {
        viewSlug: this.viewSlug,
      });
  }
};

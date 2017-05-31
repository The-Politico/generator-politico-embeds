const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  initializing() {
    this.composeWith('politico-interactives:linters');
    this.composeWith('politico-interactives:gulp');
    this.composeWith('politico-interactives:styles');
    this.composeWith('politico-interactives:aws');
  }

  prompting() {
    const questions = [{
      type: 'input',
      name: 'title',
      message: 'Welcome to your new interactive embed. What will we call it?',
    }];

    return this.prompt(questions).then((answers) => {
      this.title = answers.title;
    });
  }
  template() {
    this.composeWith(require.resolve('../meta'), {
      title: this.title,
    });
    this.composeWith(require.resolve('../templates'), {
      title: this.title,
    });
  }
};

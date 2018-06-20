const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  initializing() {
    this.composeWith('politico-interactives:passphrase');
    this.composeWith('politico-interactives:linters');
    this.composeWith('politico-interactives:gulp-common');
    this.composeWith('politico-interactives:gulp-statics');
    this.composeWith('politico-interactives:styles');

     // local version of gulp statics includes custom embed.html generation
    this.composeWith(require.resolve('../gulp-statics'));
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

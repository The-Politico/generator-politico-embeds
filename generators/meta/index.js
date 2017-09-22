const Generator = require('yeoman-generator');
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

  writing() {
    this.title = this.options.title;
    this.slug = S(this.title).slugify().s;

    const timestamp = new Date();
    const publishPath = `${timestamp.getFullYear()}/embed/${this.slug}/`
    const url = `https://www.politico.com/interactives/${publishPath}`;

    this.fs.copy(
      this.templatePath('gitignore'),
      this.destinationPath('./.gitignore'));

    this.fs.copyTpl(
      this.templatePath('package.json'),
      this.destinationPath('package.json'), {
        slug: this.slug,
        userName: this.user.git.name(),
        userEmail: this.user.git.email(),
      });

    this.fs.copyTpl(
      this.templatePath('README.md'),
      this.destinationPath('README.md'), {
        slug: this.slug,
        path: publishPath,
        title: this.title,
        userName: this.user.git.name(),
        userEmail: this.user.git.email(),
        url: url,
        year: timestamp.getFullYear(),
      });

    const metaJSON = {
      id: (Math.floor(Math.random() * 100000000000) + 1).toString(),
      publishPath,
      url: `${url}`,
    };

    this.fs.writeJSON('meta.json', metaJSON);
  }

};

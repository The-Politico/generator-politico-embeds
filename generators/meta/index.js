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
    const publishPath = `interactives/${timestamp.getFullYear()}/embed/${this.slug}/`;
    const prodUrl = `https://www.politico.com/${publishPath}`;
    const stagingUrl = `https://s3.amazonaws.com/staging.interactives.politico.com/${publishPath}index.html`;

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
        stagingUrl,
        url: prodUrl,
        year: timestamp.getFullYear(),
      });

    const metaJSON = {
      id: (Math.floor(Math.random() * 100000000000) + 1).toString(),
      publishPath,
      url: prodUrl,
      stagingUrl,
    };

    this.fs.writeJSON('meta.json', metaJSON);
  }

};

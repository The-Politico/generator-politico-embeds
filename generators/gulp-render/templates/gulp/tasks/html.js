const context = require('../../server/context.js');
const gulp = require('gulp');
const nunjucksRender = require('gulp-nunjucks-render');
const nunjucksSettings = require('../../server/nunjucks-settings.js');
const rename = require('gulp-rename');

const manageEnvironment = (environment) => {
  environment.addFilter('markdown', nunjucksSettings.markdownFilter);
};

module.exports = () => {
  const ctx = context.getContext();
  ctx.env = 'production';

  return gulp.src('src/templates/graphics/*.html')
    .pipe(nunjucksRender({
      path: ['src/templates'],
      data: ctx,
      manageEnv: manageEnvironment,
    }))
    .pipe(rename((path) => {
      path.dirname = path.basename;
      path.basename = 'index';
    }))
    .pipe(gulp.dest('dist/'));
};

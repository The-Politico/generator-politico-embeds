const gulp = require('gulp');
const glob = require('glob');
const nunjucksRender = require('gulp-nunjucks-render');
const context = require('../../server/context.js');
const nunjucksSettings = require('../../server/nunjucks-settings.js');

const manageEnvironment = (environment) => {
  environment.addFilter('markdown', nunjucksSettings.markdownFilter);
};

module.exports = () => {
  const ctx = context.getContext();
  ctx.env = 'production';
  ctx.routes = glob.sync('src/templates/graphics/*.html');

  return gulp.src([
    'src/templates/**/*.html',
    '!src/templates/**/_*.html',
    '!src/templates/graphics/*.html',
  ]).pipe(nunjucksRender({
    path: ['src/templates/'],
    data: ctx,
    manageEnv: manageEnvironment,
  })).pipe(gulp.dest('dist'));
};

const gulp = require('gulp');
const rename = require('gulp-rename');
const tap = require('gulp-tap');
const nunjucksRender = require('gulp-nunjucks-render');
const context = require('../../server/context.js');
const nunjucksSettings = require('../../server/nunjucks-settings.js');

const manageEnvironment = (environment) => {
  environment.addFilter('markdown', nunjucksSettings.markdownFilter);
};

function makePreview(slug, ctx) {
  return gulp.src([
    'src/templates/_preview.html',
  ]).pipe(nunjucksRender({
    path: ['src/templates/'],
    data: Object.assign(ctx, { slug }),
  })).pipe(rename((opt) => {
    opt.basename = 'preview';
  }))
    .pipe(tap((file, t) => t.through(gulp.dest, [`dist/${slug}`])));
}


module.exports = () => {
  const ctx = context.getContext();
  ctx.env = 'production';

  let graphicName = null;

  return gulp.src([
    'src/templates/graphics/*.html',
    '!src/templates/graphics/_*.html',
  ]).pipe(nunjucksRender({
    path: ['src/templates/'],
    data: ctx,
    manageEnv: manageEnvironment,
  })).pipe(rename((opt) => {
    graphicName = opt.basename;
    opt.basename = 'embed';
  }))
    .pipe(tap((file, t) => t.through(makePreview, [graphicName, ctx])))
    .pipe(tap((file, t) => t.through(gulp.dest, [`dist/${graphicName}`])));
};

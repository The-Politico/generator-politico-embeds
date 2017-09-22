const express = require('express');
const glob = require('glob');
const context = require('./context.js');

const router = express.Router();


router.get('/', (req, res) => {
  const ctx = context.getContext();

  glob('src/templates/graphics/*.html', (er, files) => {
    ctx.routes = files;
    res.render('_index.html', ctx);
  });
});

router.get('/:graphic', (req, res) => {
  const ctx = context.getContext();
  ctx.slug = req.params.graphic;
  res.render('_preview.html', ctx);
});

router.get('/embed/:graphic', (req, res) => {
  const ctx = context.getContext();
  ctx.dev = true;
  res.render(`graphics/${req.params.graphic}.html`, ctx);
});

module.exports = router;

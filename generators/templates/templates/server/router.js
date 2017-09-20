const express = require('express');
const glob = require('glob');
const router = express.Router();

const context = require('./context.js')


router.get('/', function(req, res) {
  const ctx = context.getContext();

  glob('src/templates/graphics/*.html', (er, files) => {
    ctx['routes'] = files
    res.render('index.html', ctx);
  });
});

router.get('/:graphic', function(req, res) {
  const ctx = context.getContext();
  ctx['slug'] = req.params.graphic;
  res.render('preview.html', ctx);
});

router.get('/embed/:graphic', function(req, res) {
  const ctx = context.getContext();
  ctx['dev'] = true;
  res.render(`graphics/${req.params.graphic}.html`, ctx);
});

module.exports = router;

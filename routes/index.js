var express = require('express');
var router = express.Router();

/* GET page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next){
  res.render('login')
})

router.get('/page', function(req, res, next){
  res.render('page')
})


module.exports = router;

var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser')
var session = require('express-session')

/* GET page. */
router.post('/', function(req, res) {
  console.log(req.body)
})

router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/admin', function(req, res, next) {
  res.render('admin');
});

router.get('/signup', function(req, res, next) {
  res.render('signup');
});

router.get('/profile', function(req, res, next) {
  res.render('profile');
});

router.get('/cart', function(req, res, next) {
  res.render('cart');
});

router.get('/products', function(req, res, next) {
  res.render('products');
});

router.get('/product-detail', function(req, res, next) {
  res.render('product-detail');
});

router.get('/status', function(req, res, next) {
  res.render('status');
});

router.get('/order-detail', function(req, res, next) {
  res.render('order-detail');
});

router.get('/checkout', function(req, res, next) {
  res.render('checkout');
});

router.get('/login', function(req, res, next){
  console.log(req.locals);
  console.log(req.body)
  res.render('login')
})


module.exports = router;

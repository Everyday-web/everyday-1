var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser')
var session = require('express-session')
const {isLoggedin} = require('../middleware/users')

/* GET page. */
router.post('/', function(req, res) {
  console.log(req.body)
})

router.get('/' , isLoggedin ,function(req, res, next) {
  if(req.cookies.token){
    return res.render('index', {
      loginstate: 1,
      usernamedata: req.userData
    });
  }else{
    return res.render('index', {
      loginstate: 0
    });
  }
  
});

router.get('/admin', function(req, res, next) {
  res.render('admin');
});

router.get('/signup', function(req, res, next) {
  if(req.cookies.token){
    return res.redirect('/');
  }
  return res.render('signup');
});

router.get('/profile', isLoggedin, function(req, res, next) {
  if(!req.cookies.token){
    return res.redirect('/login');
  }
  return res.render('profile', {
    loginstate: 1,
    usernamedata: req.userData
  });
});

router.get('/cart', isLoggedin ,function(req, res, next) {
  if(!req.cookies.token){
    return res.redirect('/login');
  }
  return res.render('cart', {
    loginstate: 1,
    usernamedata: req.userData
  });
});

router.get('/products', isLoggedin, function(req, res, next) {
  if(req.cookies.token){
    return res.render('products', {
      loginstate: 1,
      usernamedata: req.userData
    });
  }else{
    return res.render('products', {
      loginstate: 0
    });
  }
});

router.get('/product-detail', isLoggedin, function(req, res, next) {
  // res.render('product-detail');
  if(req.cookies.token){
    return res.render('product-detail', {
      loginstate: 1,
      usernamedata: req.userData
    });
  }else{
    return res.render('product-detail', {
      loginstate: 0
    });
  }
});

router.get('/status', isLoggedin,function(req, res, next) {
  if(!req.cookies.token){
    return res.redirect('/login');
  }
  return res.render('status', {
    loginstate: 1,
    usernamedata: req.userData
  });
});

router.get('/order-detail', isLoggedin,function(req, res, next) {
  // res.render('order-detail');
  if(!req.cookies.token){
    return res.redirect('/login');
  }
  return res.render('order-detail', {
    loginstate: 1,
    usernamedata: req.userData
  });
});

router.get('/checkout', isLoggedin, function(req, res, next) {
  if(!req.cookies.token){
    return res.redirect('/login');
  }
  return res.render('checkout', {
    loginstate: 1,
    usernamedata: req.userData
  });
});

router.get('/login', function(req, res, next){
  if(req.cookies.token){
    return res.redirect('/');
  }
  return res.render('login')
})

router.get('/logout', isLoggedin ,function(req, res, next){
  if(req.cookies.token){
    res.clearCookie('token');
    return res.redirect('/');
  }
  return res.redirect('/');
})


module.exports = router;

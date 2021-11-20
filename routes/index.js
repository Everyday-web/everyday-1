var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser')
var session = require('express-session')
const { isLoggedin } = require('../middleware/users')
const { getprofile } = require('../controller/user/profile')
const { getorders } = require('../controller/user/order');
const { decodeBase64 } = require('bcryptjs');
const db = require("../db/db.js");
const fileUpload = require('express-fileupload');
router.use(fileUpload());
router.use(express.static('uploads'));

/* GET page. */
router.post('/', function (req, res) {
  console.log(req.body)
})

router.get('/', isLoggedin, function (req, res, next) {
  db.query(`SELECT SUM(order_details.order_details_qty) as qty_total, book.book_id, book.book_name, book.book_details, book.book_image FROM order_details JOIN book ON order_details.book_id = book.book_id GROUP BY book.book_id  ORDER BY qty_total  DESC LIMIT 0,3`, (err, result) => {
    db.query(`SELECT book_id, book_name, book_details, book_price, book_image FROM book GROUP BY book_id DESC LIMIT 0,6`, (err, result1) => {
      // return console.log(result);
      if (req.cookies.token) {
        return res.render('index', {
          loginstate: 1,
          usernamedata: req.userData,
          data: result,
          data1: result1
        });
      } else {
        return res.render('index', {
          loginstate: 0,
          data: result,
          data1: result1
        });
      }
    })
  })
  // if(req.cookies.token){
  //   return res.render('index', {
  //     loginstate: 1,
  //     usernamedata: req.userData
  //   });
  // }else{
  //   return res.render('index', {
  //     loginstate: 0
  //   });
  // }

});

router.get('/admin', function (req, res, next) {
  res.render('admin');
});

router.get('/signup', function (req, res, next) {
  if (req.cookies.token) {
    return res.redirect('/');
  }
  return res.render('signup');
});

router.get('/profile', isLoggedin, getprofile, function (req, res, next) {
  if (!req.cookies.token) {
    return res.redirect('/login');
  } else {
    return res.render('profile', {
      loginstate: 1,
      usernamedata: req.userData,
      userprofiledata: req.userProfile
    });
  }

});

router.get('/cart', isLoggedin, function (req, res, next) {
  let id = req.userData.userid;
  db.query(`SELECT * FROM cart JOIN book ON cart.book_id = book.book_id JOIN users ON cart.user_id = users.user_id WHERE users.user_id = ` + id, (err, result) => {
    // return console.log(result)
    if (!req.cookies.token) {
      return res.redirect('/login');
    }
    return res.render('cart', {
      loginstate: 1,
      usernamedata: req.userData,
      data: result
    });
  })

});

router.get('/products', isLoggedin, function (req, res, next) {
  db.query(`SELECT * FROM book ORDER BY book_id ASC`, (err, result) => {
    if (req.cookies.token) {
      return res.render('products', {
        loginstate: 1,
        usernamedata: req.userData,
        data: result
      });
    } else {
      return res.render('products', {
        loginstate: 0,
        data: result
      });
    }
  })

});

router.get('/product-detail/:id', isLoggedin, function (req, res, next) {
  let id = req.params.id;
  db.query(`SELECT * FROM book WHERE book_id = ` + id, (err, result) => {
    // return console.log(result)
    if (req.cookies.token) {
      return res.render('product-detail', {
        loginstate: 1,
        usernamedata: req.userData,
        data: result
      });
    } else {
      return res.render('product-detail', {
        loginstate: 0,
        data: result
      });
    }
  })

});

router.get('/status', isLoggedin, function (req, res, next) {
  db.query(`SELECT * FROM order_details JOIN book ON order_details.book_id = book.book_id JOIN orders ON order_details.order_id = orders.order_id JOIN payment ON order_details.payment_id = payment.payment_id JOIN users ON orders.user_id = users.user_id WHERE users.user_id = ${req.userData.userid} ORDER BY order_details_id ASC`, (err, result) => {
    // return console.log(req.userData.userid)
    if (req.cookies.token) {
      return res.render('status', {
        loginstate: 1,
        usernamedata: req.userData,
        orderlistdata: req.orderlist,
        data: result
      });
      // return res.redirect('/login');
    } else {
      return res.redirect('/login');
    }
  })

  // console.log(req.orderlist)

});

router.get('/order-detail', isLoggedin, function (req, res, next) {
  // res.render('order-detail');
  if (!req.cookies.token) {
    return res.redirect('/login');
  }
  return res.render('order-detail', {
    loginstate: 1,
    usernamedata: req.userData
  });
});

router.get('/checkout', isLoggedin, function (req, res, next) {
  // return console.log(req.userData.userid)
  let id = req.userData.userid;
  db.query(`SELECT * FROM cart JOIN book ON cart.book_id = book.book_id JOIN users ON cart.user_id = users.user_id WHERE users.user_id = ` + id, (err, result) => {
    // return console.log(result)
    if (!req.cookies.token) {
      return res.redirect('/login');
    }
    return res.render('checkout', {
      loginstate: 1,
      usernamedata: req.userData,
      data: result
    });
  })

});

router.get('/login', function (req, res, next) {
  if (req.cookies.token) {
    return res.redirect('/');
  }
  return res.render('login')
})

router.get('/logout', isLoggedin, function (req, res, next) {
  if (req.cookies.token) {
    res.clearCookie('token');
    return res.redirect('/');
  }
  return res.redirect('/');
})

router.get('/search', function (req, res) {
  connection.query('SELECT book_name from book where book_name like "%' + req.query.key + '%"',
    function (err, rows, fields) {
      if (err) throw err;
      var data = [];
      for (i = 0; i < rows.length; i++) {
        data.push(rows[i].book_name);
      }
      res.end(JSON.stringify(data));
    });
})
module.exports = router;

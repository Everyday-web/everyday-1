let express = require('express');
let router = express.Router();
const db = require("../db/db.js");
const {getorders} = require('../controller/user/order')
const userMiddleware = require("../middleware/users.js");


router.get('/orders', userMiddleware.isLoggedin, getorders)

// router.get('/', (req, res, next) => {

    // db.query('SELECT * FROM order_details JOIN book ON order_details.book_id = book.book_id JOIN `order` ON order_details.order_id = order.order_id JOIN payment ON order_details.payment_id = payment.payment_id JOIN users ON order.user_id = users.user_id ORDER by order_details_id ASC', (err, rows) => {
    //     if(err){
    //         res.render('orders/orders',{data: ''});
    //     }
    //     else{
    //         res.render('orders/orders',{data: rows});
    //     }
    // })
    // db.query('SELECT * FROM order_details join book on order_details.book_id=book.book_id join order on order_details.order_id=order.order_id WHERE order_id = data.order_id', (err, rows) => {
    //     if(err){
    //         res.render('orders/orders',{data2: ''});
    //     }
    //     else{
    //         res.render('orders/orders',{data2: rows});
    //     }
    // })
// })

module.exports = router;
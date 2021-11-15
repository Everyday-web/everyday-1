let express = require('express');
let router = express.Router();
let dbCon = require('../db/db');

router.get('/', (req, res, next) => {
    dbCon.query('SELECT * FROM order_details join book on order_details.book_id=book.book_id join order on order_details.order_id=order.order_id join payment on order_details.payment_id=payment.payment_id join users on order.user_id=users.user_id ORDER by order_details_id asc', (err, rows) => {
        if(err){
            res.render('data',{order_details: ''});
        }
        else{
            res.render('data',{order_details: rows});
        }
    })
    dbCon.query('SELECT * FROM order_details join book on order_details.book_id=book.book_id join order on order_details.order_id=order.order_id WHERE order_id = data.order_id', (err, rows) => {
        if(err){
            res.render('data2',{order_details: ''});
        }
        else{
            res.render('data2',{order_details: rows});
        }
    })
})

module.exports = router;
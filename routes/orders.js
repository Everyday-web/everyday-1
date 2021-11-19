let express = require('express');
let router = express.Router();
const fileUpload = require('express-fileupload');
const db = require("../db/db.js");
router.use(fileUpload());
router.use(express.static('uploads'));

router.get('/', (req, res, next) => {
    db.query('SELECT * FROM order_details JOIN book ON order_details.book_id = book.book_id JOIN orders ON order_details.order_id = orders.order_id JOIN payment ON order_details.payment_id = payment.payment_id JOIN users ON orders.user_id = users.user_id  WHERE order_status IN (1,2,3) ORDER by order_details_id ASC', (err, rows) => {
        if (err) {
            res.render('orders/orders', { data: '' });
        }
        else {
            db.query(`SELECT user_username FROM users WHERE role = 'admin'`, (err, rows1) => {
                if (err) {
                    res.render('orders/orders', { data1: '' });
                }
                else {
                    res.render('orders/orders', {
                        data: rows,
                        data1: rows1
                    });
                }
            });
        }
        // db.query(`SELECT user_username FROM users WHERE role = 'admin'`, (err, result) =>{
        //     if(err){
        //         res.render('orders/orders',{user: ''});
        //     }
        //     else{
        //         res.render('orders/orders',{user: result[0].user_username});
        //     }
        // })
    })

})

//display view order page
router.get('/views/(:id)', (req, res, next) => {
    let id = req.params.id;

    db.query('SELECT * FROM order_details JOIN book ON order_details.book_id = book.book_id JOIN orders ON order_details.order_id = orders.order_id JOIN payment ON order_details.payment_id = payment.payment_id JOIN users ON orders.user_id = users.user_id WHERE order_details_id = ' + id, (err, rows, fields) => {

        // return console.log(rows[0]);
        if (rows.length <= 0) {
            res.redirect('/orders');
        } else {
            res.render('orders/views', {
                title: 'View Order',
                id: rows[0].order_details_id,
                cusname: rows[0].user_cusname,
                bookname: rows[0].book_name,
                totalprice: rows[0].order_totalprice,
                qty: rows[0].order_details_qty,
                image: rows[0].payment_image,
                status: rows[0].payment_status
            })
        }
    });
})

//confirm payment
router.post('/confirm/(:id)', (req, res, next) => {
    let id = req.params.id;
    let errors = false;

    //if no error
    if (!errors) {
        db.query(`UPDATE order_details JOIN payment ON order_details.payment_id = payment.payment_id SET payment.payment_status = 2 WHERE order_details.order_details_id = ` + id, (err, result) => {
            if (err) {
                throw err;
            }
            else {
                console.log("payment status successfully updated!");
                res.redirect('/orders');
            }
        })
    }
    else {
        errors = true;
        console.log("error to update payment status");
    }



})

//display edit orders
router.get('/edit/(:id)', (req, res, next) => {
    let id = req.params.id;

    db.query('SELECT * FROM order_details JOIN book ON order_details.book_id = book.book_id JOIN orders ON order_details.order_id = orders.order_id JOIN payment ON order_details.payment_id = payment.payment_id JOIN users ON orders.user_id = users.user_id WHERE order_details_id = ' + id, (err, rows, fields) => {

        // return console.log(rows[0]);
        if (rows.length <= 0) {
            res.redirect('/orders');
        } else {
            res.render('orders/editorders', {
                title: 'Edit Order',
                id: rows[0].order_details_id,
                cusname: rows[0].user_cusname,
                bookname: rows[0].book_name,
                totalprice: rows[0].order_totalprice,
                quantity: rows[0].order_details_qty,
                image: rows[0].payment_image,
                status: rows[0].order_status
            })
        }
    });
})

const {getorders} = require('../controller/user/order');
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


//update orders
router.post('/update/(:id)', (req, res, next) => {
    let id = req.params.id;
    let errors = false;

    //if no error
    if (!errors) {
        db.query(`UPDATE order_details JOIN orders ON order_details.order_id = orders.order_id SET orders.order_status = ${db.escape(req.body.status)} WHERE order_details.order_details_id = ` + id, (err, result) => {
            if (err) {
                throw err;
            }
            else {
                console.log("order status successfully updated!");
                res.redirect('/orders');
            }
        })
    }
    else {
        errors = true;
        console.log("error to update order status");
    }

});

//delete orders
router.get('/delete/(:id)', (req, res, next) => {
    let id = req.params.id;
    // console.log(req.params);
    db.query('DELETE FROM order_details WHERE order_details_id = ' + id, (err, result) => {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: "Error Query1"
            });
            // res.redirect('/orders');
        } else {
            db.query('DELETE FROM payment WHERE order_id = ' + id, (err, result) => {
                if (err) {
                    return res.status(400).send({
                        status: 400,
                        message: "Error Query2"
                    });
                }
                else {
                    db.query('DELETE FROM `order` WHERE order_id = ' + id, (err, result) => {
                        if (err) {
                            return res.status(400).send({
                                status: 400,
                                message: "Error Query3"
                            });
                        }
                        else {
                            // return res.status(200).send({
                            //     status: 200,
                            //     message: "Your order has been deleted."
                            // });
                            res.redirect('/orders');
                        }
                    });

                }
            });

        }
    })
})

router.get('/history', (req, res, next) => {
    db.query('SELECT * FROM order_details JOIN book ON order_details.book_id = book.book_id JOIN orders ON order_details.order_id = orders.order_id JOIN payment ON order_details.payment_id = payment.payment_id JOIN users ON orders.user_id = users.user_id  WHERE order_status IN (4,5) ORDER by order_details_id ASC', (err, rows) => {
        if (err) {
            res.render('orders/orders', { data: '' });
        }
        else {
            db.query(`SELECT user_username FROM users WHERE role = 'admin'`, (err, rows1) => {
                if (err) {
                    res.render('orders/history', { data1: '' });
                }
                else {
                    res.render('orders/history', {
                        data: rows,
                        data1: rows1
                    });
                }
            });
        }
        // db.query(`SELECT user_username FROM users WHERE role = 'admin'`, (err, result) =>{
        //     if(err){
        //         res.render('orders/orders',{user: ''});
        //     }
        //     else{
        //         res.render('orders/orders',{user: result[0].user_username});
        //     }
        // })
    })

})


module.exports = router;
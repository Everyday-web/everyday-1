const express = require('express');
const router = express.Router();
const db = require("../db/db.js");
const { checkadmin } = require('../middleware/admin.js');
const { isLoggedin } = require('../middleware/users.js');



//display dashboard page
router.get('/', isLoggedin, checkadmin, (req, res, next) => {
    db.query(`SELECT user_username FROM users WHERE role = 'admin'`, (err, result) => {
        // return console.log(result);
        if (err) {
            res.render('page/dashboard', { name: '' });
        }
        else {
            db.query(`SELECT SUM(order_totalprice) as total FROM orders WHERE order_status = 4`, (err, result1) => {
                if (err) {
                    res.render('page/dashboard', { data: '' });
                } else {
                    db.query(`SELECT COUNT(order_id) as waiting FROM orders WHERE order_status = 1`, (err, result2) => {
                        if (err) {
                            res.render('page/dashboard', { name: '' });
                        }
                        else {
                            db.query(`SELECT SUM(order_details.order_details_qty) as qty_total, book.book_name FROM order_details JOIN book ON order_details.book_id = book.book_id GROUP BY book.book_id  ORDER BY qty_total  DESC LIMIT 0,3`, (err, result3) => {
                                if (err) {
                                    res.render('page/dashboard', { name: '' });
                                }
                                else {
                                    db.query(`SELECT COUNT(order_id) as total FROM orders`, (err, result4) => {
                                        if (err) {
                                            res.render('page/dashboard', { name: '' });
                                        }
                                        else {
                                            res.render('page/dashboard', {
                                                name: result[0].user_username,
                                                data: result1[0].total,
                                                data1: result2[0].waiting,
                                                data2: result3[0].book_name,
                                                data3: result4[0].total
                                            });
                                        }
                                    })

                                }
                            })

                        }
                    })

                }

            })
        }
    });
});

module.exports = router;
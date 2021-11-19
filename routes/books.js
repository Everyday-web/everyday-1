const express = require('express');
const router = express.Router();
const fileUpload = require('express-fileupload');
const db = require("../db/db.js");
router.use(fileUpload());
router.use(express.static('uploads'));


//display book page
router.get('/', (req, res, next) => {
    db.query('SELECT * FROM book ORDER BY book_id ASC', (err, rows) => {
        if (err) {

            res.render('books/books', { data: '' });
        }
        else {
            db.query(`SELECT user_username FROM users WHERE role = 'admin'`, (err, rows1) => {
                if (err) {
                    res.render('books/books', { data1: '' });
                }
                else {
                    res.render('books/books', {
                        data: rows,
                        data1: rows1
                    });
                }
            });
        }
    });
});

//display add book page
router.get('/add', (req, res, next) => {
    res.render('books/add', {
        name: '',
        details: '',
        price: '',
        quantity: '',
        image: '',
        type: ''
    });
});

//add new book
router.post('/add', (req, res, next) => {
    // return console.log(req.body.type);
    if (!req.body || !req.files || isNaN(Number(req.body.price)) || isNaN(parseInt(req.body.quantity))) {
        return console.log("Data invalid!");
    }
    // return console.log(req.body), console.log(req.files)
    let name = req.body.name;
    let details = req.body.details;
    let price = req.body.price;
    let quantity = req.body.quantity;
    let file = req.files.upload_img;
    let uploadPath = './uploads/' + file.name;
    let type = req.body.type;
    let errors = false;


    if (name.length === 0 || details.length === 0 || price.length === 0 || quantity.length === 0 || Object.keys(req.files).length === 0 || type.length === 0) {
        errors = true;
        return console.log("Please check your data!"),
            res.render('books/add', {
                name: name,
                details: details,
                price: price,
                quantity: quantity,
                image: file,
                type: type
            })
    }

    // if no error
    if (!errors) {
        file.mv(uploadPath, function (err) {
            if (err) { res.send(err) }
            else {
                // insert query
                db.query(`INSERT INTO book (book_name, book_details, book_price, book_qty, book_image, book_type) VALUES (${db.escape(req.body.name)}, ${db.escape(req.body.details)}, ${db.escape(req.body.price)}, ${db.escape(req.body.quantity)}, '${file.name}', ${db.escape(req.body.type)});`, (err, result) => {
                    if (err) {
                        throw err;
                    }
                    if (result === undefined || result.length == 0) {
                        return console.log("Data not found!");
                    }
                    else {
                        return console.log("Book successfully added!");
                    }
                });
            }
        });
    }
})


// display edit book page
router.get('/edit/(:id)', (req, res, next) => {
    let id = req.params.id;

    db.query('SELECT * FROM book WHERE book_id = ' + id, (err, rows, fields) => {

        // return console.log(rows[0].book_type);
        if (rows.length <= 0) {
            res.redirect('/books');
        } else {
            res.render('books/edit', {
                title: 'Edit book',
                id: rows[0].book_id,
                name: rows[0].book_name,
                details: rows[0].book_details,
                price: rows[0].book_price,
                quantity: rows[0].book_qty,
                image: rows[0].book_image,
                type: rows[0].book_type
            })
        }
    });
})

// update book page
router.post('/update/(:id)', (req, res, next) => {
    // return console.log(req.body);
    let id = req.params.id;
    let name = req.body.name;
    let details = req.body.details;
    let price = req.body.price;
    let quantity = req.body.quantity;
    let file = null;
    let uploadPath = null;
    if (req.files) {
        file = req.files.upload_img;
        uploadPath = './uploads/' + file.name;
    }
    let errors = false;


    if (name.length === 0 || details.length === 0 || price.length === 0 || quantity.length === 0) {
        errors = true;

        res.render('books/edit', {
            id: req.params.id,
            name: name,
            details: details,
            price: price,
            quantity: quantity,
            image: file
        })
    }
    // if no error
    if (!errors) {
        if (!req.files) {
            //update query
            db.query(`UPDATE book SET book_name = ${db.escape(req.body.name)},book_details = ${db.escape(req.body.details)},
            book_price = ${db.escape(req.body.price)}, book_qty = ${db.escape(req.body.quantity)} WHERE book_id = ` + id, (err, result) => {
                if (err) {
                    throw err;
                }
                if (result === undefined || result.length == 0) {
                    return console.log("Data not found!");
                }
                else {
                    console.log("Book successfully updated!");
                    res.redirect('/books');
                }
            });
        }
        else {
            file.mv(uploadPath, function (err) {
                db.query(`UPDATE book SET book_name = ${db.escape(req.body.name)},book_details = ${db.escape(req.body.details)},
                 book_price = ${db.escape(req.body.price)}, book_qty = ${db.escape(req.body.quantity)}, book_image = '${file.name}' WHERE book_id = ` + id, (err, result) => {
                    if (err) {
                        throw err;
                    }
                    if (result === undefined || result.length == 0) {
                        return console.log("Data not found!");
                    }
                    else {
                        console.log("Book successfully updated!");
                        res.redirect('/books')
                    }
                });
            });
        }
    }
})



// delete book
router.get('/delete/(:id)', (req, res, next) => {
    let id = req.params.id;
    // console.log(req.params);
    db.query('DELETE FROM book WHERE book_id = ' + id, (err, result) => {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: "Error Query"
            });
            // res.redirect('/books');
        } else {
            // return res.status(200).send({
            //     status: 200,
            //     message: "Your book has been deleted."
            // });
            res.redirect('/books');
        }
    })
})

module.exports = router;
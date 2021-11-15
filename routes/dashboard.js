const express = require('express');
const router = express.Router();
const db = require("../db/db.js");



//display dashboard page
router.get('/', (req, res, next) => {
    db.query(`SELECT user_username FROM users WHERE role = 'admin'`, (err, result) => {
        // return console.log(result);
        if (err) {
            res.render('page/dashboard', { name: '' });
        }
        else {
            res.render('page/dashboard', { name: result[0].user_username });
        }
    });
});

module.exports = router;
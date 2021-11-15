let express = require('express');
let router = express.Router();
let dbCon = require('db.js');

router.get('/', (req, res, next) => {
    dbCon.query('SELECT * FROM book order by id desc', (err, rows) => {
        if(err){
            req.flash('error', err);
            res.render('book')
        }
    })
})
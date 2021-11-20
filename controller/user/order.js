var db = require('../../db/db')
var express = require('express');
var router = express.Router();
const fileUpload = require('express-fileupload');
router.use(fileUpload());
router.use(express.static('uploads'));

function getorders(req, res, next) {
    // console.log(req.userData)
    db.query(`SELECT * FROM orders WHERE user_id = ${req.userData.userid}`, (selerr, selresults) => {
        if (selerr) throw selerr
        return console.log(selresults);
        if (selresults === undefined || selresults.length == 0) {
            // return 
        }
        else {
            req.orderlist = selresults
            return next()
        }

    })
}

module.exports = {
    getorders 
}
var db = require('../../db/db')

function getorders(req, res, next) {
    console.log(req.userData)
    db.query(`SELECT * FROM orders WHERE user_id = ${req.userData.userid}`, (selerr, selresults) =>{
        if(selerr) throw selerr
        // console.log(selresults);
        if(selresults === undefined || selresults.length == 0){
            return 
        }
        req.orderlist = selresults
        return next()
    })
}

module.exports = {
    getorders
}
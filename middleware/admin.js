var db = require('../db/db')

function checkadmin(req, res, next) {
    if(!req.userData){
        return res.redirect('/'); 
    }
    db.query(`SELECT * FROM users WHERE user_id = ${req.userData.userid} AND role = 2`,(selerr, selre) =>{
        if(selerr) throw selerr
        if(selre === undefined || selre.length == 0){
            res.status(400).send({
                status: 400,
                message: "ผิดพลาด"
            })
            return res.redirect('/'); 
        }
        return next()
    })
}

module.exports = {
    checkadmin
}
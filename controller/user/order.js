var db = require('../../db/db')

function getorders(req, res) {
    console.log(req.userData)
    db.query(`SELECT * FROM order`, (selerr, selresults) =>{
        if(selerr) throw selerr
        console.log(selresults);
    })
}

module.exports = {
    getorders
}
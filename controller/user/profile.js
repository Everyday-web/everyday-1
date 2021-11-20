var db = require('../../db/db')

function getprofile(req, res, next) {
    console.log(req.userData)
    db.query(`SELECT * FROM users WHERE user_id = ${req.userData.userid}`, (selusererr, seluserresults) =>{
        if(selusererr) throw selusererr
        req.userProfile = seluserresults[0]
        return next()
    })
}

function editprofile(req, res) {
    console.log(req.body)
    console.log(req.userData)
    // {
    //     name: '1',
    //     username: '2',
    //     tel: '3',
    //     mail: '4'
    //   }
    db.query(`SELECT * FROM users WHERE user_id = ${req.userData.userid}`, (selerr, selresults) =>{
        if(selerr) throw selerr
        console.log(selresults)
        if(selresults === undefined || selresults.length == 0){
            return res.status(400).send({
                status: 400,
                message: "ไม่พบข้อมูล"
            })
        }
        db.query(`UPDATE users SET user_cusname = '${req.body.name}', user_tel = '${req.body.tel}' WHERE user_id = ${req.userData.userid}`,(updateerr, updateresults) =>{
            if(updateerr) throw updateerr
            return res.redirect('/profile');
        })
    })
}

module.exports = {
    editprofile,
    getprofile
}
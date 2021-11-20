const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {v4: uuidv4} = require('uuid');

const db = require("../db/db.js");
const userMiddleware = require("../middleware/users.js");

router.get('/', (req,res)=>{
    console.log("hi")
})

// http://localhost:3000/api/login
router.post('/login', (req,res) =>{
    // return console.log(req.body);
     // {
    //     username: 'test',
    //     password: '1234567890',
    //     signin: 'Log In'
    //   }

    // return console.log(req.body);
    if(!req.body.username || !req.body.password){
        return res.status(400).send({
            status: 400,
            message: "username and password not found!"
        });
    }
    db.query(`SELECT * FROM users WHERE user_username = ${db.escape(req.body.username)} AND role = 'admin';`,(err, result) => {
        if(err){
            // throw err;
            return res.status(400).send({
                message: err,
            });
        }

        //ค่าที่ query ถ้าไม่ใช่แอดมินจะได้มาเป็น undefined หรือ length = 0 ให้มัน return ออกไป
        if(result === undefined || result.length == 0){
            return res.status(400).send({
                message: 'Error',
            });
        }

        bcrypt.compare(req.body.password, result[0]['user_password'], (bErr, bResult) => {
            if(bErr){
                //  throw bErr;
                 return res.status(400).send({
                     message: "Username or password incorrect!"
                 });
            }
            if(bResult){
                //password match
                const token = jwt.sign({
                    username: result[0]['user_cusname'],
                    userid: result[0]['user_id'],

                }, 'SECRETKEY',{expiresIn: "7d" });
                db.query(`UPDATE users SET last_login = now() WHERE user_id = '${result[0]['user_id']}'`);
                // console.log(token)

                res.cookie('tokenadmin',token, { maxAge: 604800000, httpOnly: true });
                return res.redirect('/dashboard');

                return res.status(200).send({
                    username: result[0]['user_username'],
                    message: 'Logged in!',
                    token,
                    // user: result[0]
                });
            }
            return res.status(400).send({
                status: 400,
                message: "Username or password incorrect!",
            });
        });
    });
})

// http://localhost:3000/api/secret-route
router.post('/secret-route', userMiddleware.isLoggedin, (req, res, next) => {
    console.log(req.cookies);
    console.log(req.userData);
    res.send("This is secret content!");
});    

module.exports = router;
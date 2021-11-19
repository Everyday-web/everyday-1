var db = require('../../db/db')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

function register(req, res) {
    // return console.log(req.body)
    db.query(`SELECT user_id FROM users WHERE LOWER(user_username) = LOWER('${req.body.username}')`, (err, result) => {
        if(err) throw err
        if(result.length){
            //error
            return res.status(400).send({
                message: 'This username is already use!'
            })
        } else {
            //username not in use
            bcrypt.hash(req.body.pass,10,(err,hash) => {
                if(err){
                    // throw err;
                    return res.status(500).send({
                        message: "ผิดพลาด",
                    });
                } else{
                    db.query(`INSERT INTO users (user_uuid, user_username, user_password, user_email, user_tel, user_cusname) VALUES ('${uuidv4()}', ${db.escape(req.body.username)}, '${hash}', '${req.body.email}', '${req.body.tel}', '${req.body.name}')`,(err, result) => {
                        if(err) throw err
                        return res.redirect('/login');
                        return res.status(201).send({
                            status: 201,
                            message: "register !"
                        })
                    })
                }
            });
        }
    });
}

function login(req, res) {
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
    db.query(`SELECT * FROM users WHERE user_username = ${db.escape(req.body.username)} AND role = 'member';`,(err, result) => {
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
                    username: result[0]['user_username'],
                    userid: result[0]['user_id'],

                }, 'SECRETKEY',{expiresIn: "7d" });
                db.query(`UPDATE users SET last_login = now() WHERE user_id = '${result[0]['user_id']}'`);
                // console.log(token)
                res.cookie('token',token, { maxAge: 900000, httpOnly: true });
                return res.redirect('/');
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
}



module.exports = {
    register,
    login
}
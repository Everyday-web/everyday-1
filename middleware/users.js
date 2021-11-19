const jwt = require('jsonwebtoken');
module.exports = {
    validateRegister: (req, res, next) => {
        // username min length 3
        if(!req.body.username || req.body.username.length < 3){
            return res.status(400).send({
                message: "Please enter a username with min. 3 chars",
            });
        }
        // password min length 8
        if(!req.body.pass || req.body.pass.length < 8){
            return res.status(400).send({
                message: "Please enter a password with min. 8 chars",
            });
        }
        // password (repeat) must macth
        if(!req.body.pass || req.body.pass != req.body.re_pass){
            return res.status(400).send({
                message: "Both passwords must match",
            });
        }
        next();
    },
    isLoggedin: (req, res, next) => {
        // return console.log(req.cookies);
        if(req.cookies.token){
            try{
                const tokendata = req.cookies.token;
                const decoded = jwt.verify(req.cookies.token, 'SECRETKEY');
                req.userData = decoded;
                // console.log(req.userData)
                next();
            } catch(err){
                throw err;
                return res.status(400).send({
                    message: "Your session is not valid!",
                });
            }
        }else{
            return next()
        }
        // if(!req.headers.authorization){
        //     return res.status(400).send({
        //         message: "Your session is not valid!",
        //     });
        // }

    },
}
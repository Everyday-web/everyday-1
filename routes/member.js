const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {v4: uuidv4} = require('uuid');
const {register, login} = require('../controller/user/auth')
const {editprofile} = require('../controller/user/profile')

const db = require("../db/db.js");
const userMiddleware = require("../middleware/users.js");

// router.get('/', (req, res)=>{
//     console.log("this member router");
// })


// http://localhost:3000/api/user/sign-up
router.post('/sign-up', userMiddleware.validateRegister, register)

// http://localhost:3000/api/login
router.post('/login', login)


router.post('/profile/edit', userMiddleware.isLoggedin, editprofile)

// http://localhost:3000/api/secret-route
router.post('/secret-route', userMiddleware.isLoggedin, (req, res, next) => {
    console.log(req.cookies);
    console.log(req.userData);
    res.send("This is secret content!");
});    

module.exports = router;
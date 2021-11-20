var db = require('../../db/db')

function addcart(req, res) {
    // console.log(req.body);
    // console.log(req.cookies);
    // console.log(req.userData);
    if(!req.body.book_id){
        return res.status(400).send({
            status: 400,
            message: "ผิดพลาด"
        })
    }
    db.query(`SELECT * FROM cart WHERE user_id = ${req.userData.userid} AND book_id = ${req.body.book_id}`, (selerr, selre)=>{
        if(selerr) throw selerr
        if(selre === undefined || selre.length == 0){
            db.query(`INSERT INTO cart(user_id, book_id, cart_qty)VALUES(${req.userData.userid}, ${req.body.book_id}, 1)`,(inserr, insre) =>{
                if(inserr) throw inserr
                return res.send({
                    status: 200,
                    message: "เพิ่มสินค้าลงตะกร้าสำเร็จ"
                })
                // return console.log(insre);

            })
        }else{
            db.query(`UPDATE cart SET cart_qty = cart_qty + 1 WHERE user_id = ${req.userData.userid} AND book_id = ${req.body.book_id} AND cart_status = 1`,(updateerr, updatere) =>{
                if(updateerr) throw updateerr
                return res.send({
                    status: 200,
                    message: "เพิ่มสินค้าลงตะกร้าสำเร็จ"
                })
                // return console.log(updatere);
            })
        }
    })
}
function addcartcount(req, res) {
    
}
function removecart(req, res) {
    
}

module.exports = { 
    addcart,
    addcartcount,
    removecart
}
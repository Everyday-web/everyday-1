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
    db.query(`SELECT * FROM cart WHERE user_id = ${req.userData.userid} AND book_id = ${req.body.book_id} AND cart_status = 1`, (selerr, selre)=>{
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
    if(!req.body.type || !req.body.book_id){
        return res.status(400).send({
            status: 400,
            message: "error methods"
        })
    }

    if(req.body.type === "add"){
        db.query(`UPDATE cart SET cart_qty = cart_qty + 1 WHERE user_id = ${req.userData.userid} AND book_id = ${req.body.book_id} AND cart_status = 1`,(updateerr, updatere) =>{
            if(updateerr) throw updateerr
            return res.send({
                status: 200,
                message: "เพิ่มสินค้าลงตะกร้าสำเร็จ"
            })
        })
    }
    if(req.body.type === "remove"){
        db.query(`SELECT * FROM cart WHERE user_id = ${req.userData.userid} AND book_id = ${req.body.book_id} AND cart_status = 1`,(selcarterr, selcartre)=>{
            if(selcartre[0]['cart_qty'] < 1){
                return res.status(400).send({
                    status: 400,
                    message: "ไม่สามารถลดสินค้าได้"
                })
            }else{
                db.query(`UPDATE cart SET cart_qty = cart_qty - 1 WHERE user_id = ${req.userData.userid} AND book_id = ${req.body.book_id} AND cart_status = 1`,(updateerr, updatere) =>{
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

}
function removecart(req, res) {
    if(!req.body.book_id){
        return res.status(400).send({
            status: 400,
            message: "ผิดพลาด"
        })
    }
    db.query(`SELECT * FROM cart WHERE user_id = ${req.userData.userid} AND book_id = ${req.body.book_id} AND cart_status = 1`, (selerr, selre)=>{
        if(selerr) throw selerr
        if(selre === undefined || selre.length == 0){
            return res.status(400).send({
                status: 400,
                message: "ไม่พบสินค้า"
            })
        }
        db.query(`DELETE FROM cart WHERE user_id = ${req.userData.userid}, book_id = ${req.body.book_id} AND cart_status = 1 `,(inserr, insre) =>{
            if(inserr) throw inserr
            return res.send({
                status: 200,
                message: "เพิ่มสินค้าลงตะกร้าสำเร็จ"
            })
            // return console.log(insre);

        })
    })
}

module.exports = { 
    addcart,
    addcartcount,
    removecart
}
var db = require('../../db/db')

function checkout(req, res, next) {
    
    console.log(req.files)
    return console.log(req.body)
    db.query(`SELECT * FROM cart a INNER JOIN book b ON a.book_id = b.book_id WHERE a.cart_status = 1 AND a.user_id = ${req.userData.userid}`,(selerr, selcart) =>{
       if(selerr) throw selerr
       console.log(selcart)
        db.query(`INSERT INTO orders(user_id) VALUES (${req.userData.userid})`,(insordererr, insorderre)=>{
            if(insordererr) throw insordererr
            for (let i = 0; i < selcart.length; i++) {
                if(selcart[i]['book_id'] > 0){
                    db.query(`INSERT INTO order_details(order_id, book_id, order_details_qty, order_details_oneprice) VALUE (${insorderre.insertId}, ${selcart[i]['book_id']}, ${selcart[i]['cart_qty']}, ${selcart[i]['book_price']})`,(detailerr, detailresults) =>{
                        if(detailerr) throw detailerr
                        console.log(detailresults);
                    })
                }
            }
        })
    })
}

module.exports = { 
    checkout
}
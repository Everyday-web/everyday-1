const mysql = require('mysql2');

const connection = mysql.createConnection(
    {
        host: "proy.thoranin.org",
        user: "proywanat",
        database: "everyday",
        password: "*2K2va0o",
    }
);
connection.connect((error)=>{
    if(error){
        console.log(error);
    }
    else{
        console.log('Database Connected..');
    }
});
module.exports = connection;
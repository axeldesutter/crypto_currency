let mysql = require('mysql');

let connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database: 'crypto'
})

connection.connect();

module.exports = connection
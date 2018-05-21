let ip = require('ip');
let connection = require('../config/database.js');

class User{

    constructor(row){
        this.row = row
    }

    get ip(){ return this.row.ip }
    get bank(){ return this.row.bank }
    get wallet(){ return this.row.wallet }

    static init(callback){
        var userIp = ip.address();
        connection.query('SELECT * FROM users WHERE ip = ?', [userIp], (err,rows) => {
            if(err) throw err
            if(rows.length > 0){
                callback(new User(rows[0]))
            }else{
                connection.query('INSERT INTO users SET ip = ?', [userIp], (err, results) => {
                    if(err) throw err
                    callback('new');
                })
            }
        })
    }

}

module.exports = User;
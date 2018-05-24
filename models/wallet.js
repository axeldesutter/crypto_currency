let ip = require('ip');
let connection = require('../config/database.js');

class Wallet{

    static getValueAfterBought(callback){
        var maximalPieces = 50000;
        connection.query('SELECT SUM(wallet) AS value FROM users', (err,results) => {
            if(err) throw err;
            callback((maximalPieces/(maximalPieces-(results[0].value-100))));
        })
    }

    static getValueAfterSold(callback){
        var maximalPieces = 50000;
        connection.query('SELECT SUM(wallet) AS value FROM users', (err,results) => {
            if(err) throw err;
            callback((maximalPieces/(maximalPieces-(results[0].value+100))));
        })
    }

    static getValue(callback){
        var maximalPieces = 50000;
        connection.query('SELECT SUM(wallet) AS value FROM users', (err,results) => {
            if(err) throw err;
            callback((maximalPieces/(maximalPieces-results[0].value)));
        })
    }
    
    static sell(username,amount,callback){
        if(amount !== undefined || amount !== ''){        
            if(!isNaN(amount)){
                var userIp = ip.address()
                connection.query('SELECT * FROM users WHERE ip = ?', [username], (err,rows) => {
                    if(err) throw err;
        
                    var currentWallet = rows[0].wallet;
                    var newWallet = currentWallet - parseInt(amount);
                    var currentBank = rows[0].bank;
                    this.getValueAfterSold((value) => {
                        // Calculate cost price
                        var newBank = currentBank + 100;
                        // Verification
                        if(currentWallet < 100){
                            callback('Vous n\'avez pas assez sur votre compte');
                        }else{              
                            if(parseInt(amount) > 100){
                                callback('Vous ne pouvez pas vendre plus de 100€ à la fois, désolé.');
                            }else{
                                connection.query('UPDATE users SET bank = ?,wallet = ? WHERE ip = ?', [newBank, newWallet, username], (err, results) => {
                                    if(err) throw err;
                                    callback('Ok');
                                })
                            }
                        }
                    })
                })
            }else{
                callback();
            }
        }
    }

    static buy(username,amount,callback){
        if(amount !== undefined || amount !== ''){        
            if(!isNaN(amount)){
                var userIp = ip.address()
                connection.query('SELECT * FROM users WHERE ip = ?', [username], (err,rows) => {
                    if(err) throw err;
        
                    var currentWallet = rows[0].wallet;
                    var newWallet = currentWallet + parseInt(amount);
                    var currentBank = rows[0].bank;
                    this.getValueAfterBought((value) => {
                        // Calculate cost price
                        var newBank = currentBank - 100;
                        // Verification
                        if(newBank < 0){
                            callback('Vous n\'avez pas assez sur votre compte');
                        }else{              
                            if(parseInt(amount) > 100){
                                callback('Vous ne pouvez pas acheter plus de 100$ à la fois, désolé.');
                            }else{
                                connection.query('UPDATE users SET bank = ?,wallet = ? WHERE ip = ?', [newBank, newWallet, username], (err, results) => {
                                    if(err) throw err;
                                    callback('Ok');
                                })
                            }
                        }
                    })
                })
            }else{
                callback();
            }
        }
    }

}

module.exports = Wallet
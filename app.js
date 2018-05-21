let express = require('express');
let bodyParser = require('body-parser');
let session = require('express-session');
let socket = require('socket.io');
let app = express();

app.set('view engine', 'ejs');
app.use(express.static('assets'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(session({
  secret: 'key',
  resave: false,
  saveUninitialized: true,
  cookie: {secure: false}
}))
app.use(require('./middlewares/flash.js'));

let io = socket(app.listen(8080));

io.on('connection', (socket) => {
    socket.on('bought', (data) => {
        let Wallet = require('./models/wallet');
        Wallet.getValueAfterSold((value) => {
            io.sockets.emit('fluctuation', {value});
        })
    })

    socket.on('sold', (data) => {
        let Wallet = require('./models/wallet');
        Wallet.getValueAfterBought((value) => {
            io.sockets.emit('fluctuation', {value});
        })
    })
})

app.get('/', (req,res) => {
    let User = require('./models/user')
    User.init((response) => {
        if(response !== 'new'){
            let Wallet = require('./models/wallet');
            Wallet.getValue((value) => {
                res.render('pages/index.ejs', {user: response, value: value});
            })
        }else{
            res.render('pages/loading.ejs');
        }
    })
})

app.get('/loading', (req, res) => {
    res.render('pages/loading.ejs');
})

app.get('/sell', (req,res) => {
    let User = require('./models/user')
    User.init((response) => {
        if(response !== 'new'){
            let Wallet = require('./models/wallet');
            Wallet.getValue((value) => {
                res.render('pages/sell.ejs', {user: response, value: value});
            })
        }else{
            res.render('pages/loading.ejs');
        }
    })
})

app.get('/pricing', (req,res) => {
    res.render('pages/pricing.ejs');
})

app.get('/about', (req,res) => {
    res.render('pages/about.ejs');
})

// Post

app.post('/', (req,res) => {
    let Wallet = require('./models/wallet')
    Wallet.buy(req.body.amount, (callback) => {
        if(callback != 'Ok'){
            req.flash('error', callback);
            res.redirect('/');
        }else{
            req.flash('success', 'Transaction effectuée');
            res.redirect('/');
        }
    })
})

app.post('/sell', (req,res) => {
    let Wallet = require('./models/wallet')
    Wallet.sell(req.body.amount, (callback) => {
        if(callback != 'Ok'){
            req.flash('error', callback);
            res.redirect('/sell');
        }else{
            req.flash('success', 'Transaction effectuée');
            res.redirect('/');
        }
    })
})
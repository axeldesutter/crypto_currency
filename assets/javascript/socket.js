// Connect to socket
const io = require('socket.io-client')
const socket = io.connect('http://localhost:8080', { reconnect: true });
//var socket =  io.connect('http://localhost:8080');

$('#buy-btn').click(function(e){
    socket.emit('bought', "reload")
})


$('#sell-btn').click(function(e){
    socket.emit('sold', "reload")
})

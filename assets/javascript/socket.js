// Connect to socket
var socket =  io.connect('http://localhost:8080');

$('#buy-btn').click(function(e){
    socket.emit('bought', "reload")
})


$('#sell-btn').click(function(e){
    socket.emit('sold', "reload")
})
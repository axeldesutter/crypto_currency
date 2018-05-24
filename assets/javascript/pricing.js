// Connect to socket
const io = require('socket.io-client')
const socket = io.connect('http://localhost:8080', { reconnect: true });
//var socket =  io.connect('http://localhost:8080');
var backgroundColor = ['rgba(54, 162, 235, 0.2)','rgba(54, 162, 235, 0.2)'];
var borderColor = ['rgba(54, 162, 235, 1)','rgba(54, 162, 235, 1)'];
var labels = ["",""];
var chartData = [1,1];
// Listen for event
socket.on('fluctuation', (data) => {
    chartData.push(data.value);
    labels.push('');
    backgroundColor.push('rgba(54, 162, 235, 1)')
    borderColor.push('rgba(54, 162, 235, 1)')
    myChart.update();
})

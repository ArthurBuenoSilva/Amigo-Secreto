const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

var name = ''
var names = []
var room_owner = ''
var is_first_name = true
var there_equal = false
var sorteou = false

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    socket.emit('insertParticipant', names)

    socket.on('send name', (text) => {
        name = text.toUpperCase()

        if(is_first_name && room_owner === ''){
            names.push(name)
            is_first_name = false
            room_owner = name
        }
        else{
            if (names.indexOf(name) === -1){
                names.push(name)
            }else{
                socket.emit('error_message', (name + ' já existe!'))
            }
        }

        socket.emit('room_owner', room_owner)
        io.emit('removeAllParticipant', names)
        io.emit('insertParticipant', names)
    })

    socket.on('sortear', () => {
        while(names.length !== 0){
            var nSorteado = -1
            var name = names[0]
            var sorteado = name
            while(sorteado === name){
                nSorteado = Math.floor(Math.random() * names.length)
                sorteado = names[nSorteado]
            }

            names.shift()
            var temp = names[nSorteado]
            names.splice(nSorteado)
            names.unshift(temp)

            io.emit('sorteado', [name, sorteado])
        }
    })
})

io.on('disconnection', (socket) =>{

})

server.listen(3000, () => {
    console.log('listening on *:3000')
})
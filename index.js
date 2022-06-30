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
        let exist = false

        if (names.indexOf(name) !== -1){
            exist = true
            socket.emit('error_message', (name + ' já existe!'))
        }

        if (!exist){
            if(is_first_name && room_owner === ''){
                names.push(name)
                is_first_name = false
                room_owner = name
            }
            else
                names.push(name)

            socket.emit('hide')
            socket.emit('room_owner', room_owner)
            io.emit('removeAllParticipant', names)
            io.emit('insertParticipant', names)
        }
    })

    socket.on('sortear', () => {
        if(names.length % 2 === 0){
            let aux = []

            for (let i = 0; i < names.length; i++) {
                aux.push(names[i])
            }

            for (let i = aux.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [aux[i], aux[j]] = [aux[j], aux[i]];
            }

            while(aux.length !== 0){
                io.emit('sorteado', [aux[0], aux[1]])
                aux.shift()
                aux.shift()
            }
        }else{
            socket.emit('error_message', 'Não foi possível sortear, a quantidade de participantes na sala deve ser par')
        }
    })
})

server.listen(3000, () => {
    console.log('listening on *:3000')
})
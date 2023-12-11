const express = require('express');
const app = express();

const http = require('http');
const path = require('path');
const server = http.createServer(app);
const { Server } = require('socket.io');
const { addUser } = require('./utils/users');
const io = new Server(server);

io.on('connection', (socket) => {
    console.log('socket', socket.id);

    socket.on('join', (options, callback) => {
        const { error, user } = addUser({ id: socket.id, ...options });
        if(error) {
            return callback(error);
        };

        socket.join(user.room);
    });
    socket.on('sendMessage', () => {});
    socket.on('disconnet', () => {});
});

app.use(express.static(path.join(__dirname, '../public')));

const port = process.env.SERVER_PORT;
server.listen(port, () => {
    console.log(`Running on port ${port}`);
}); 
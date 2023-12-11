const express = require('express');
const app = express();

const http = require('http');
const path = require('path');
const server = http.createServer(app);
const { Server } = require('socket.io');
const { addUser, getUsersInRoom, getUser } = require('./utils/users');
const { generateMessage } = require('./utils/messages');
const io = new Server(server);

io.on('connection', (socket) => {
    console.log('socket', socket.id);

    socket.on('join', (options, callback) => {
        const { error, user } = addUser({ id: socket.id, ...options });
        if(error) {
            return callback(error);
        };

        socket.join(user.room);

        socket.emit('message', generateMessage('Admin', `${user.room} 방에 오신 것을 환영합니다.`));
        socket.broadcast.to(user.room).emit('message', generateMessage('', `${user.username}가 방에 참여했습니다.`));

        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        });
    });

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);

        io.to(user.room).emit('message', generateMessage(user.username, message));
        callback();
    });

    socket.on('disconnet', () => {
        console.log('socket disconnected', socket.id);
    });
});

app.use(express.static(path.join(__dirname, '../public')));

const port = process.env.SERVER_PORT;
server.listen(port, () => {
    console.log(`Running on port ${port}`);
}); 
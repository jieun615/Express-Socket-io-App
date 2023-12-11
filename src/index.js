const express = require('express');
const app = express();

const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

app.use(express.static(path.join(__dirname, '../public')));

const port = process.env.SERVER_PORT;
server.listen(port, () => {
    console.log(`Running on port ${port}`);
}); 
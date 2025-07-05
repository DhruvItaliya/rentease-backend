// src/server.js
import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import connect from './configs/connection.js';
import envConfig from './configs/envConfig.js';
import { socketHandler } from './socket/socketHandler.js';

envConfig();
const PORT = process.env.PORT || 5000;

// Connect to DB
connect();

// Create server and bind Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: [process.env.React_API, 'http://192.168.29.228:5173'],
        methods: ['GET', 'POST', 'PATCH', 'PUT'],
        credentials: true
    }
});

// Attach io to app
app.set('io', io);

// Register socket handlers
socketHandler(io);

// Start the server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

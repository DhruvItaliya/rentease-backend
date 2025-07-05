// src/socket/socketHandler.js
export const socketHandler = (io) => {
    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        socket.on('joinDispute', (disputeId) => {
            socket.join(disputeId);
            console.log(`Socket ${socket.id} joined dispute ${disputeId}`);
        });

        socket.on('leaveDispute', (disputeId) => {
            socket.leave(disputeId);
            console.log(`Socket ${socket.id} left dispute ${disputeId}`);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
};

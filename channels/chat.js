/*!
 * Chat
 * create: 2018/09/07
 * since: 0.0.1
 */
'use strict';

const client = function(socket) {
  socket.server.httpServer.logger.info('Socket.io: A client connected');

  socket.on('disconnect', () => {
    socket.server.httpServer.logger.info('Socket.io: Client disconnected');
  });

  socket.on('chat', message => {
    socket.server.httpServer.logger.info(`Client: ${message}`);
    this.emit('chat', `IO broadcast: ${message}`);
    socket.broadcast.emit('chat', `Cient broadcast: ${message}`);
    socket.emit('chat', `Self: ${message}`);
  });
};

module.exports = io => io.of('/chat').on('connect', client);

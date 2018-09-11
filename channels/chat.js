/*!
 * Chat
 * create: 2018/09/07
 * since: 0.0.1
 */
'use strict';

const emitter = require('socket.io-emitter');

const client = function(socket) {
  socket.server.httpServer.logger.info('Socket.io: A user connected');

  socket.on('disconnect', () => {
    socket.server.httpServer.logger.info('Socket.io: User disconnected');
  });

  socket.on('chat', message => {
    socket.server.httpServer.logger.info(`Client: ${message}`);
    this.emit('chat', `IO broadcast: ${message}`);
    socket.broadcast.emit('chat', `Cient broadcast: ${message}`);
    socket.emit('chat', `Self: ${message}`);
  });

  // Redis emitter
  let io_emitter = emitter(socket.server._adapter.pubClient || socket.server._adapter.subClient);
  setInterval(() => io_emitter.of('/chat').emit('chat', new Date), 1000);
};

module.exports = io => io.of('/chat').on('connect', client);

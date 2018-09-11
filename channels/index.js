/*!
 * Channels
 * create: 2018/09/07
 * since: 0.0.1
 */
'use strict';

const Server = require('socket.io');
const emitter = require('socket.io-emitter');

const channels = [
  require('./chat'),
];

module.exports = (httpServer, options = {}) => {
  let io = new Server(httpServer, options);
  channels.forEach(channel => channel(io));

  let io_emitter = emitter(io._adapter.pubClient || io._adapter.subClient);
  setInterval(() => io_emitter.of('/chat').emit('chat', new Date), 1000);
};

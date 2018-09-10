/*!
 * Channels
 * create: 2018/09/07
 * since: 0.0.1
 */
'use strict';

const Server = require('socket.io');

const channels = [
  require('./chat'),
];

module.exports = (httpServer, options = {}) => {
  const io = new Server(httpServer, options);
  channels.forEach(channel => channel(io));
};

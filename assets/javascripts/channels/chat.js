/*!
 * Chat
 * create: 2018/09/07
 * since: 0.0.1
 */
'use strict';

import io from 'socket.io-client';
import options from './base';

export default io('/chat', { ...options });

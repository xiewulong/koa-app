/*!
 * Socket
 * xiewulong <xiewulong@vip.qq.com>
 * create: 2018/09/07
 * since: 0.0.1
 */
'use strict';

const Router = require('koa-router');

const router = module.exports = new Router();

router.prefix('/socket');

// GET /socket/chat
Router.api.tags.push({ name: '/socket', description: '聊天室', externalDocs: { description: '链接', url: '/socket' } });
router.get('GET_socket_index', '/', async (ctx, next) => {
  ctx.render('socket/index.html');
});

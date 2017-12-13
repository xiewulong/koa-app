/*!
 * dashboard
 * xiewulong <xiewulong@vip.qq.com>
 * create: 2017/12/13
 * since: 0.0.1
 */
'use strict';

const Router = require('koa-router');

const router = module.exports = new Router();

router
  .prefix('/dashboard')
  .redirect('/', 'dashboard')
  .get('dashboard', '/index', async (ctx, next) => {
    ctx.render('dashboard/index.html');
  })
  ;

/*!
 * Controllers
 * xiewulong <xiewulong@vip.qq.com>
 * create: 2017/12/13
 * since: 0.0.1
 */
'use strict';

const Router = require('koa-router');

const router = module.exports = new Router();

[
  require('./dashboard'),
  require('./home'),
].forEach(controller => router.use(controller.routes(), controller.allowedMethods()));

router
  .redirect('/', 'home')
  ;

/*!
 * User
 * create: 2018/05/07
 * since: 0.0.1
 */
'use strict';


const Router = require('koa-router');
const User = require('../models/user');
const router = module.exports = new Router();

router.prefix('/user');

// GET /user/login
Router.api.tags.push({name: '/user/login', description: '用户登录页', externalDocs: {description: '链接', url: '/user/login'}});
router.get('GET_user_login', '/login', async (ctx, next) => {
  if(ctx.authenticate(false)) {
    return ctx.redirect(ctx.user_referrer || ctx.router.url('GET_dashboard'));
  }

  ctx.render('user/login.html');
});

// POST /user/login
Router.api.paths['/user/login'] = {};
Router.api.paths['/user/login']['post'] = {
  tags: ['/user/login'],
  summary: '登录提交',
  operationId: 'POST_user_login',
  parameters: [
    {'$ref': '#/definitions/CsrfParameter'},
  ],
  requestBody: {
    description: '请求数据',
    required: true,
    content: {
      'application/x-www-form-urlencoded': {
        schema: {
          // type: 'object',
          required: ['mobile', 'password', 'sms_code'],
          properties: {
            username: {description: '用户名', type: 'string', example: 'Koa'},
            password: {description: '登录密码', type: 'string', example: '123456'},
          },
        },
      },
    },
  },
  responses: {
    '200': {description: '请求成功'},
    '403': {description: '请求失败'},
    '403.logined': {description: '用户已登录, 跳回首页'},
  },
};
router.post('POST_user_login', '/login', async (ctx, next) => {
  let user = new User(ctx.request.permit(['username', 'password']));

  if(ctx.authenticate(false)) {
    user.add_error('logined', '用户已登录');
  } else {
    await user.login();
  }

  if(!user.is_valid) {
    ctx.status = 403;
    ctx.body = user.errors;
    return;
  }

  ctx.login(user.id);

  ctx.body = {
    message: ctx.i18n.__('app.words.operation_succeeded'),
    redirect_to: ctx.user_referrer || ctx.router.url('GET_dashboard'),
  };
});

// POST /user/logout
Router.api.paths['/user/logout'] = {};
Router.api.paths['/user/logout']['post'] = {
  tags: ['/dashboard'],
  summary: '注销提交',
  operationId: 'POST_user_logout',
  parameters: [
    {'$ref': '#/definitions/CsrfParameter'},
  ],
  responses: {
    '200': {description: '请求成功'},
    '403': {description: '请求失败'},
  },
};
router.post('POST_user_logout', '/logout', async (ctx, next) => {
  ctx.logout();

  ctx.body = {
    message: ctx.i18n.__('app.words.operation_succeeded'),
    redirect_to: ctx.get('Referrer') || '/',
  };
});

/*!
 * app
 * xiewulong <xiewulong@vip.qq.com>
 * create: 2017/12/13
 * since: 0.0.1
 *
 * required process.env
 * APP_MAILER_FROM
 * APP_MAILER_SMTP_ADDRESS
 * APP_MAILER_SMTP_PORT
 * APP_MAILER_SMTP_USERNAME
 * APP_MAILER_SMTP_PASSWORD
 */
'use strict';

const Koa = require('koa');
const body = require('koa-body');
const Pug = require('koa-pug');
const session = require('koa-session');
const controllers = require('./controllers');

const app = module.exports = new Koa();
const development = app.env === 'development';
const production = app.env === 'production';

const pug = new Pug({
  app,
  // basedir: '',
  compileDebug: development,
  debug: development,
  helperPath: [],
  locals: {},
  noCache: development,
  pretty: development,
  viewPath: 'views',
});
// const transporter = nodemailer.createTransport({
//   host: process.env.APP_MAILER_SMTP_ADDRESS,
//   port: process.env.APP_MAILER_SMTP_PORT,
//   // secure: false,
//   auth: {
//     user: process.env.APP_MAILER_SMTP_USERNAME,
//     pass: process.env.APP_MAILER_SMTP_PASSWORD,
//   },
//   logger: development,
//   debug: development,
// });

app.keys = ['APP COOKIE SECRET KEY'];
app
  .use(session({
    // domain: ${ctx.host},
    // httpOnly: true,
    // key: 'koa:sess',
    // maxAge: 86400000,
    // overwrite: true,
    // rolling: false,
    // signed: true,
  }, app))
  .use(body())
  .use(async (ctx, next) => {
    ctx.pug = pug;
    // ctx.mail = (data, callback) => transporter.sendMail(Object.assign({from: process.env.APP_MAILER_FROM}, data), callback);

    await next();
  })
  // .use(async (ctx, next) => {
  //   const start = Date.now();
  //   await next();
  //   const ms = Date.now() - start;
  //   ctx.set('X-Response-Time', `${ms}ms`);
  // })
  // .use(async (ctx, next) => {
  //   const start = Date.now();
  //   await next();
  //   const ms = Date.now() - start;
  //   console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
  // })
  .use(controllers.routes(), controllers.allowedMethods())
  .use(async (ctx) => {
    ctx.status = 404;

    let text = 'Page Not Found';
    switch(ctx.accepts('html', 'json')) {
      case 'html':
        ctx.type = 'html';
        ctx.body = `<p>${text}</p>`;
        break;
      case 'json':
        ctx.body = {message: text};
        break;
      default:
        ctx.type = 'text';
        ctx.body = text;
    }
  })
  ;

// !module.parent && app.listen(process.env.APP_PORT);
app.listen(process.env.APP_PORT);

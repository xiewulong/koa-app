/*!
 * App
 * xiewulong <xiewulong@vip.qq.com>
 * create: 2017/12/13
 * since: 0.0.1
 *
 * Required process.env
 * APP_MAILER_FROM
 * APP_MAILER_SMTP_ADDRESS
 * APP_MAILER_SMTP_PORT
 * APP_MAILER_SMTP_USERNAME
 * APP_MAILER_SMTP_PASSWORD
 */
'use strict';

const child_process = require('child_process');
const fs = require('fs');
const path = require('path');
const log4js = require('log4js');
const yaml = require('js-yaml');
const Koa = require('koa');
const bodyparser = require('koa-bodyparser');
const CSRF = require('koa-csrf');
const flash = require('koa-flash');
const i18n = require('koa-i18n');
const locale = require('koa-locale');
const mailer = require('koa-mailer-v2');
const mongo = require('koa-mongo');
const mongo_bucket = require('koa-mongo-bucket');
const Pug = require('koa-pug');
const rbac = require('koa-rbac');
const redis = require('koa-redis');
const session = require('koa-session');
const ability = require('./ability');
const controllers = require('./controllers');
const pkg = require('./package.json');

const app = module.exports = new Koa();
const development = app.env === 'development';

log4js.configure({
  appenders: {
    console: {type: 'console'},
    dateFile: {
      type: 'dateFile',
      filename: path.join('log', `${app.env}.log`),
      options: {keepFileExt: true},
      pattern: '.yyyyMMdd',
      layout: {
        type: 'pattern',
        pattern: '%d{yyyy-MM-dd hh:mm:ss.SSS}  %p [%x{name},ceb3bdbe38e9e5e8,ceb3bdbe38e9e5e8,true] %z --- [nio-9080-exec-2] c.c.l.c.a.filter.util.UserClaims         : %m',
        tokens: {
          name: pkg.name,
        },
      },
    },
  },
  categories: {
    default: {appenders: ['console', 'dateFile'], level: development && 'debug' || 'info'},
  },
  disableClustering: true,
});

app.keys = [process.env.APP_SECRET_KEY_BASE];
app.context.logger = log4js.getLogger();
app.context.pug = new Pug({
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
app.context.redis = redis({
  url: process.env.APP_REDIS_MASTER,
});

locale(app);

app
  .use(mongo({
    uri: process.env.APP_MONGO,
    // max: 100,
    // min: 1
  }))
  .use(mongo_bucket())
  .use(session({
    domain: process.env.APP_SESSION_DOMAIN,
    // httpOnly: true,
    key: process.env.APP_SESSION_KEY,
    // maxAge: 86400000,
    // overwrite: true,
    // rolling: false,
    // signed: true,
    store: redis({
      url: process.env.APP_REDIS_MASTER,
      prefix: 'session:',
    }),
  }, app))
  .use(new CSRF({
    // invalidSessionSecretMessage: 'Invalid session secret',
    // invalidSessionSecretStatusCode: 403,
    // invalidTokenMessage: 'Invalid CSRF token',
    // invalidTokenStatusCode: 403,
    // excludedMethods: ['GET', 'HEAD', 'OPTIONS'],
    // disableQuery: false,
  }))
  .use(flash())
  .use(bodyparser({
    // detectJSON: (ctx) => {},
    // disableBodyParser: false,
    // enableTypes: ['json', 'form'],
    // encode: 'utf-8',
    // extendTypes: [],
    // formLimit: '56kb',
    // jsonLimit: '1mb',
    // onerror: (err, ctx) => {},
    // strict: true,
    // textLimit: '1mb',
  }))
  .use(i18n(app, {
    directory: 'locales',
    locales: ['zh-CN', 'en'],   // `zh-CN` defualtLocale, must match the locales to the filenames
    extension: '.yml',
    parse: data => yaml.safeLoad(data),
    dump: data => yaml.safeDump(data),
    modes: [
      'query',            // optional detect querystring - `/?locale=en-US`
      // 'subdomain',     // optional detect subdomain   - `zh-CN.koajs.com`
      // 'cookie',        // optional detect cookie      - `Cookie: locale=zh-TW`
      // 'header',        // optional detect header      - `Accept-Language: zh-CN,zh;q=0.5`
      // 'url',           // optional detect url         - `/en`
      // 'tld',           // optional detect tld(the last domain) - `koajs.cn`
      // function() {},   // optional custom function (will be bound to the koa context)
    ],
  }))
  .use(mailer({
    from: process.env.APP_MAILER_FROM,
    host: process.env.APP_MAILER_SMTP_ADDRESS,
    port: process.env.APP_MAILER_SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.APP_MAILER_SMTP_USERNAME,
      pass: process.env.APP_MAILER_SMTP_PASSWORD,
    },
    logger: development,
    debug: development,
    test: development,
  }))
  .use(async (ctx, next) => {
    ctx.pug.locals.csrf = ctx.csrf;
    ctx.pug.locals.flash = ctx.flash;

    let start = Date.now();
    await next();
    ctx.logger.info(`${ctx.method} ${ctx.url} - ${Date.now() - start}ms`);
  })
  .use(rbac({
    rbac: ability,
    identity: ctx => 'john.smith',
    // identity: ctx => ctx && ctx.user,
    // restrictionHandler(ctx, permissions, redirectUrl) {
    //   ctx.status = 403;
    // },
  }))
  .use(rbac.allow(['read']))
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

// !module.parent &&
  app.listen(process.env.APP_PORT, () => app.context.logger.info(`${pkg.name} is running${process.env.APP_PORT &&  ' at ' + process.env.APP_PORT || ''}.`));

// listener
[
  'controllers',
  'locales',
  'ability.js',
  'app.js',
].forEach((filename) => fs.watch(filename, {recursive: true}, (eventType, filename) => child_process.exec('npm run restart')));

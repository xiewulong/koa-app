/*!
 * App
 * xiewulong <xiewulong@vip.qq.com>
 * create: 2017/12/13
 * since: 0.0.1
 */
'use strict';

const child_process = require('child_process');
const fs = require('fs');
const path = require('path');
const log4js = require('log4js');
const yaml = require('js-yaml');
const Koa = require('koa');
const bodyparser = require('koa-bodyparser');
const captcha = require('koa-captcha-v2');
const CSRF = require('koa-csrf');
const devise = require('koa-devise');
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
const static_middleware = require('koa-static');
const ability = require('./ability');
const controllers = require('./controllers');
const pkg = require('./package.json');
const User = require('./models/user');

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
        pattern: '%d{yyyy-MM-dd hh:mm:ss.SSS} %p %x{name} %z: %m',
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
  .use(static_middleware('public', {
    // br: true,              // Try to serve the brotli version of a file automatically when brotli is supported by a client and if the requested file with .br extension exists (note, that brotli is only accepted over https)
    // defer: false,          // If true, serves after return next(), allowing any downstream middleware to respond first.
    // extensions: false,     // Try to match extensions from passed array to search for file when no extension is sufficed in URL. First found is served
    // gzip: true,            // Try to serve the gzipped version of a file automatically when gzip is supported by a client and if the requested file with .gz extension exists
    // hidden: false,         // Allow transfer of hidden files
    // index: 'index.html',   // Default file name
    // maxage: 0,             // Browser cache max-age in milliseconds
    // setHeaders: {},        // Function to set custom headers on response
  }))
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
    // renew: false,
    // rolling: false,
    // signed: true,
    store: redis({
      url: process.env.APP_REDIS_MASTER,
      prefix: 'session:',
    }),
  }, app))
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
  .use(new CSRF({
    // invalidSessionSecretMessage: 'Invalid session secret',
    // invalidSessionSecretStatusCode: 403,
    // invalidTokenMessage: 'Invalid CSRF token',
    // invalidTokenStatusCode: 403,
    // excludedMethods: ['GET', 'HEAD', 'OPTIONS'],
    // disableQuery: false,
  }))
  .use(i18n(app, {
    directory: 'i18n',
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
  .use(captcha({
    // background: '#fff',       // Background color, default: white
    // background_image: null,   // Background image, default: null
    // case_sensitivity: false,  // Case sensitivity, default: false
    // char_pool: '0123456789',  // Char pool, like: abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789, default: 0123456789
    // char_length: 6,           // Char length, default: 6
    // color: '#000',            // Color, default: black
    // font_family: 'SpicyRice', // Font family, default SpicyRice
    // font_size: '30px',        // Font size, default: 30px
    // font_style: 'normal',     // Font style, default: normal
    // font_weight: 'normal',    // Font weight, default: normal
    // fonts: {},                // Custom font files path
    // height: 60,               // Height, default: 60
    // prefix: 'captcha_',       // Session key prefix, default: `captcha_${key}`
    // rotate: 30,               // Rotation amplitude, default: 30, then the angle range is -30 to 30
    // timeout_in: 60 * 1000,    // Timeout, default: 1 minute
    // type: 'character',        // Captcha type, default: random character
    // width: 160,               // Width, default: 160
  }))
  .use(devise({
    // context_key: 'user',       // Identity key in context, default: user
    // login_url: '/user/login',  // Login in url for session none, default: '/user/login'
    // session_key: 'user',       // Devise key in session, default: user
    // timeout_in: 0,             // Expire time, default: 0 is session max age
  }, id => User.find(id)))
  .use(async (ctx, next) => {
    ctx.pug.locals.csrf = ctx.csrf;
    ctx.pug.locals.current_user = ctx.user;
    ctx.pug.locals.flash = ctx.flash;
    ctx.pug.locals.version = development ? '' : pkg.version;
    ctx.request.permit = (names = [], defaults = {}) => {
      if(!ctx.request.body || !Object.keys(ctx.request.body).length) {
        return defaults;
      }

      let params = {};
      for(let name, param, i = 0, len = names.length; i < len; i++) {
        name = names[i];
        param = ctx.request.body[name];
        if(param === undefined) {
          continue;
        }

        params[name] = param;
      }

      return Object.assign({}, params, defaults);
    };

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
  .use(async ctx => {
    ctx.status = 404;

    let message = ctx.i18n.__('app.words.not_found');
    switch(ctx.accepts('html', 'json')) {
      case 'html':
        ctx.render('home/error.html', {message});
        // ctx.type = 'html';
        // ctx.body = `<p>${text}</p>`;
        break;
      case 'json':
        ctx.body = {message};
        break;
      default:
        ctx.type = 'text';
        ctx.body = message;
    }
  })
  ;

// !module.parent &&
  app.listen(process.env.APP_PORT, () => app.context.logger.info(`${pkg.name} is running${process.env.APP_PORT &&  ' at ' + process.env.APP_PORT || ''}.`));

// Listener
development &&  [
                  'controllers',
                  // 'middlewares',
                  'models',
                  'ability.js',
                  'app.js',
                ].forEach(filename => {
                  fs.watch(filename, {recursive: true}, (eventType, filename) => {
                    app.context.logger.info(`${filename}: ${eventType}`);
                    child_process.exec('touch ./tmp/restart.txt');
                  });
                });

/*!
 * Home
 * xiewulong <xiewulong@vip.qq.com>
 * create: 2017/12/13
 * since: 0.0.1
 */
'use strict';

const fs = require('fs');
const mongo = require('koa-mongo');
const multer = require('koa-multer');
const Router = require('koa-router');

const router = module.exports = new Router();

router
  .prefix('/home')
  .redirect('/', 'home')
  .get('home', '/index', async (ctx, next) => {
    // console.log(await ctx.rbac.check('read'));
    // console.log(await ctx.rbac.check('create'));
    // console.log(await ctx.rbac.check('update'));
    // console.log(await ctx.rbac.check('delete'));
    // console.log(await ctx.rbac.check('manage'));

    ctx.render('home/index.html');
  })
  .get('/hello', async (ctx, next) => {
    ctx.body = ctx.i18n.__('hello');
  })
  .get('/mailer', async (ctx, next) => {
    ctx.mailer({
      to: 'mail_to@domain.com',
      subject: 'Test mail',
      text: ctx.pug.render('mails/home_mailer.text', ctx.state),
      html: ctx.pug.render('mails/home_mailer.html', ctx.state),
    }, (error, info, nodemailer) => {
      if (error) {
        return console.log(error);
      }

      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });

    ctx.body = 'Sent!';
  })
  .get('/file', async (ctx, next) => {
    ctx.render('home/file.html');
  })
  .post('/upload', multer({dest: './tmp'}).single('file'), async (ctx, next) => {
    let file = await ctx.mongo.bucket.upload(ctx.req.file.path, ctx.req.file.originalname);
    fs.unlink(ctx.req.file.path, err => {});

    ctx.redirect(`/home/files/${file._id}`);
  })
  .get('/files/:id', async (ctx, next) => {
    let file = await ctx.mongo.collection('fs.files').findOne({_id: mongo.ObjectId(ctx.params.id)});

    ctx.etag = file.md5;
    ctx.lastModified = file.uploadDate;
    ctx.status = 200;
    if(ctx.fresh) {
      return ctx.status = 304;
    }

    ctx.type = file.filename;
    (ctx.query.download || !/^image\/.*$/.test(ctx.type)) && ctx.attachment(file.filename);

    ctx.body = await ctx.mongo.bucket.stream(file._id);
  })
  ;

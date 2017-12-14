/*!
 * Home
 * xiewulong <xiewulong@vip.qq.com>
 * create: 2017/12/13
 * since: 0.0.1
 */
'use strict';

const Router = require('koa-router');

const router = module.exports = new Router();

router
  .prefix('/home')
  .redirect('/', 'home')
  .get('home', '/index', async (ctx, next) => {
    ctx.render('home/index.html');
  })
  .get('/mailer', async(ctx, next) => {
    let mail_text = 'It\'s just a test mail!';
    ctx.mailer({
      to: 'mail_to@domain.com',
      subject: 'Test mail',
      text: ctx.pug.render('mails/home_mailer.text', {text: mail_text}),
      html: ctx.pug.render('mails/home_mailer.html', {text: mail_text}),
    }, (error, info, nodemailer) => {
      if (error) {
        return console.log(error);
      }

      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });

    ctx.body = 'Sent!';
  })
  ;

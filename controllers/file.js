/*!
 * File
 * xiewulong <xiewulong@vip.qq.com>
 * create: 2018/07/25
 * since: 0.0.1
 */
'use strict';

const fs = require('fs');
const devise = require('koa-devise');
const mongo = require('koa-mongo');
const multer = require('koa-multer');
const Router = require('koa-router');

const router = module.exports = new Router();

router.prefix('/file');

// POST /file
Router.api.paths['/file'] = {};
Router.api.paths['/file']['post'] = {
  tags: [],
  summary: '文件上传',
  operationId: 'POST_file',
  parameters: [
    { '$ref': '#/definitions/CsrfParameter' },
  ],
  requestBody: {
    description: '请求数据',
    content: {
      'multipart/form-data': {
        schema: {
          type: 'object',
          required: [ 'file' ],
          properties: {
            file: { type: 'string', format: 'binary' },
          },
        },
      },
    },
  },
  responses: {
    '200': { description: '请求成功' },
    '401': { description: '请先登录再访问' },
    '403': { description: '请求失败' },
  },
};
router.post('POST_file', '/',
            devise.authenticate(false),
            multer({ dest: './tmp' }).single('file'),
            async (ctx, next) => {
              let error_message, file;
              try {
                file = await ctx.mongo.bucket.upload(ctx.req.file.path, ctx.req.file.originalname);
              } catch(e) {
                error_message = e.message;
              }

              fs.unlink(ctx.req.file.path, err => {});
              if(error_message) {
                ctx.status = 403;
              }

              ctx.body = {
                id: error_message && [ error_message ] || file._id,
              };
            });

// GET /file/:id
Router.api.paths['/file/{id}'] = {};
Router.api.paths['/file/{id}']['get'] = {
  tags: [],
  summary: '显示图片或下载文件',
  operationId: 'GET_file_id',
  parameters: [
    {
      in: 'path',
      name: 'id',
      description: 'mongoid',
      required: true,
      schema: {
        type: 'string',
      },
    },
    {
      in: 'query',
      name: 'download',
      description: '强制下载文件, 默认图片文件为直接显示, 非图片文件直接下载',
      schema: {
        type: 'string',
      },
    },
  ],
  responses: {
    '200': { description: '请求成功' },
    '403': { description: '请求失败' },
  },
};
router.get('GET_file_id', '/:id', async (ctx, next) => {
  let file;
  try {
    file = await ctx.mongo.db().collection('fs.files').findOne({ _id: mongo.ObjectId(ctx.params.id) });
  } catch(e) {
    ctx.status = 403;
    ctx.body = { id: [ e.message ] };
    return;
  }

  ctx.etag = file.md5;
  ctx.lastModified = file.uploadDate;
  ctx.status = 200;
  if(ctx.fresh) {
    return ctx.status = 304;
  }

  ctx.type = file.filename;
  (ctx.query.download || !/^image\/.*$/.test(ctx.type)) && ctx.attachment(file.filename);

  ctx.body = await ctx.mongo.bucket.stream(file._id);
});

const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const jwt = require("koa-jwt");
const token = require("./public/token");
const index = require('./routes/index')
const users = require('./routes/users')
const cors = require('koa2-cors');
// error handler
onerror(app)

app.use(cors({
  origin: function(ctx) { //设置允许来自指定域名请求
    const whiteList = ['http://localhost:8080', 'http://10.1.81.236:3999']; //可跨域白名单
    let url = ctx.header.referer.substr(0, ctx.header.referer.length - 1); 
    if(whiteList.includes(url)){
      return url // 注意，这里域名末尾不能带/，否则不成功，所以在之前我把/通过substr干掉了
    }
    return 'http://localhost:8080' //默认允许本地请求8080端口可跨域
  },
  maxAge: 5, //指定本次预检请求的有效期，单位为秒。
  credentials: true, //是否允许发送Cookie
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], //设置所允许的HTTP请求方法
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'], //设置服务器支持的所有头信息字段
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'] //设置获取其他自定义字段
}))

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'ejs'
}))

// 对没有验签通过返回的错误进行拦截处理
app.use(async (ctx, next) => {
  // 如果token没有经过验证中间件会返回401错误，可以通过下面的中间件自定义处理这个错误
  await next().catch((err)=>{
    if (401 === err.status) {
      ctx.status = 401;
      ctx.body = {
        data: '没有找到token信息，请检查接口请求头信息'
      };
      console.log("未找到token: "+ err);
    } else {
      console.log(err);
      throw err;
    }
  });
});

// unless 某些特殊接口不验证toekn 比如登录
app.use(jwt({ secret: token.secretKey }).unless({ path: [/^\/api\/user\/login/,/^\/api\/user\/regist/]}));

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app

const Koa = require('koa');
const app = new Koa();
const cors = require('koa2-cors');

app.use(cors({
  origin: function (ctx) {
    return '*';
  },
  exposeHeaders: ['Auth-Token'],
  maxAge: 5,
  credentials: true,
  // allowMethods: ['GET', 'POST', 'DELETE'],
  // allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));
app.use(async ctx => {
  ctx.body = 'Hello World';
});


const _post = 7878;
export const Server = app;
export const Port = _post;

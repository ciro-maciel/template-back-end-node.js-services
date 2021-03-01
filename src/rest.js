const serverless = require("serverless-http");
const Koa = require("koa");

const app = new Koa();

app.use(async (ctx, next) => {
  ctx.url = ctx.url.replace("/s/p", "").replace("/s/t", "");
  return next();
});

app.use(async (ctx) => {
  if (ctx.path === "/health") {
    ctx.body = { status: "ok", message: "👌 - Okay running" };
  }
});

module.exports.handler = serverless(app);

const serverless = require("serverless-http");

const Koa = require("koa");
var jwt = require("koa-jwt");

const app = new Koa();

const { SECRET } = process.env;

app.use(async (ctx, next) => {
  console.log("ctx", ctx);

  ctx.url = ctx.url.replace("/s/p", "").replace("/s/t", "");
  return next();
});

app.use(jwt({ secret: SECRET }).unless({ path: ["/", /^\/health/] }));

app.use(async (ctx) => {
  if (ctx.path === "/") {
    ctx.body = `ciro-maciel - mOnitor - services`;
  }

  if (ctx.path === "/health") {
    ctx.body = { status: "ok", message: "👌 - Okay running" };
  }
});

module.exports.handler = serverless(app);

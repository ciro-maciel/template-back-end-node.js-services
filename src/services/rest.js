const serverless = require("serverless-http");

const Koa = require("koa");
const cors = require('@koa/cors');
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");

const jwt = require("koa-jwt");

const utility = require("@rili-saas/utility");
const {
  persistence: { UnitOfWork, databases },
} = require("@rili-saas/utility/clients/backend");


const app = new Koa();
const router = new Router();

app.use(cors({
  origin: '*',
}));
app.use(bodyParser());


const { JWT_SECRET } = process.env;
const { APP_NAME } = process.env;
const { TABLE_NAME } = process.env;


const uow = new UnitOfWork(new databases.Dynamo(), TABLE_NAME);

app.use(async (ctx, next) => {
  const newUrl = ctx.url.replace("/s/p", "").replace("/s/t", "");

  ctx.url = newUrl;
  ctx.originalUrl = newUrl;

  return next();
});

app.use(
  jwt({ secret: JWT_SECRET }).unless({ path: ["/", /^\/health/] })
);


router
  .get("/", async (ctx, next) => {
    // https://koajs.com/#request
    ctx.body = `${APP_NAME} - Services`;
  })
  .get("/health", (ctx, next) => {
    ctx.body = { status: "ok", message: "👌 - Okay running" };
  })
  .get("/dummy/:param1/:param2/:param3*", async (ctx, next) => {

    const { param1, param2, param3 = null } = ctx.params;
    const { body, headers } = ctx.request;

    let dummy1 = await uow.repository().filter({
      indexName: "GSI_TYPE",
      filter: [
        {
          field: "type",
          value: "dummy",
        },
        {
          field: "param1",
          value: param1,
        },
      ],
      sort: { dir: "desc" },
    });

    dummy1 = dummy1.items.length > 0 ? dummy1.items[0] : null;

    await uow.repository().put(dummy1);

    let dummy2 = await uow.repository().findByKey({ id });

    dummy2 = {
      ...dummy2,
      param1,
      param2,
      param3,
    }

    await uow.repository().put(dummy2);

  });


app
  .use(router.routes())
  .use(router.allowedMethods());

  
module.exports.handler = serverless(app);

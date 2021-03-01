const serverless = require("serverless-http");
const serverlessExpress = require("@vendia/serverless-express");

const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((ctx, next) => {
  console.log("ctx", ctx);

  ctx.lambdaEvent =
    (ctx.headers["x-apigateway-event"] &&
      JSON.parse(decodeURIComponent(ctx.headers["x-apigateway-event"]))) ||
    {};
  ctx.lambdaContext =
    (ctx.headers["x-apigateway-context"] &&
      JSON.parse(decodeURIComponent(ctx.headers["x-apigateway-context"]))) ||
    {};
  ctx.env = (ctx.lambdaEvent && ctx.lambdaEvent.stageVariables) || process.env;

  // Workaround an inconsistency in APIG. For custom domains, it puts the
  // mapping prefix on the url, but non-custom domain requests do not. Fix it by
  // changing the path to the proxy param which has the correct value always.
  if (ctx.lambdaEvent.pathParameters && ctx.lambdaEvent.pathParameters.proxy) {
    const dummyBase = "zz://zz";
    const url = new URL(ctx.url, dummyBase);
    url.pathname = "/" + ctx.lambdaEvent.pathParameters.proxy;
    ctx.url = url.href.replace(dummyBase, "");
  }
  return next();
});

app.get("/health", (req, res) => {
  res.status(200).send({ status: "ok", message: "👌 - Okay running" });
});

// module.exports.handler = serverless(app);
module.exports.handler = serverlessExpress({ app });

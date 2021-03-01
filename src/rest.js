const serverless = require("serverless-http");
const serverlessExpress = require("@vendia/serverless-express");

const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const cors = require("cors");

const { REST_PATH } = process.env;

const app = express();

app.use(cors());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((ctx, x, next) => {
  console.log("ctx", ctx);

  ctx.url = ctx.url.replace(REST_PATH, "");

  return next();
});

app.get("/health", (req, res) => {
  res.status(200).send({ status: "ok", message: "👌 - Okay running" });
});

// module.exports.handler = serverless(app);
module.exports.handler = serverlessExpress({ app });

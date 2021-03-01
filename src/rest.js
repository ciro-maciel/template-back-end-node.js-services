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

app.use((req, res, next) => {
  console.log("req", req);
  console.log("REST_PATH", REST_PATH);
  console.log("process.env", process.env);

  const newUrl = req.url.replace("/s/p", "").replace("/s/t", "");

  req.url = newUrl;
  // req.originalUrl = newUrl;

  console.log("req", req);

  return next();
});

app.get("/health", (req, res) => {
  res.status(200).send({ status: "ok", message: "👌 - Okay running" });
});

// module.exports.handler = serverless(app);
module.exports.handler = serverlessExpress({ app });

const serverless = require("serverless-http");

const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/health", (req, res) => {
  res.status(200).send({ status: "ok", message: "👌 - Okay running" });
});

module.exports.handler = serverless(app);

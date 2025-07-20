const express = require("express");
const { constants: http } = require("http2");
const morgan = require("morgan");

const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(morgan("dev"));

app.use("/", require("./src/routers/index.router"));

app.get("/*splat", (_, res) => {
  return res.status(http.HTTP_STATUS_NOT_FOUND).json({
    success: false,
    message: "endpoint is not found",
  });
});

app.listen(8080, () => {
  console.log("Listen on port 8080...");
});
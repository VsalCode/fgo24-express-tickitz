const routers = require("express").Router();

routers.use("/auth", require("./auth.router") );

module.exports = routers;
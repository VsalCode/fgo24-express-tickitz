const routers = require("express").Router();

routers.use("/auth", require("./auth.router") );
routers.use("/user", require("./user.controller"));

module.exports = routers;
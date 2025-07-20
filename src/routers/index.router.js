const routers = require("express").Router();

routers.use("/auth", require("./auth.router") );
routers.use("/user", require("./user.router"));
routers.use("/movies", require("./movies.router"));

module.exports = routers;
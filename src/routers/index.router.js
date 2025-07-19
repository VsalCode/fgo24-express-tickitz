const routers = require("express").Router();

routers.use("/movies", require("./movies.router") )

module.exports = routers;
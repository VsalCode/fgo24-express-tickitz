const moviesRouter = require("express").Router(); 
const moviesController = require("../controllers/movies.controller");

moviesRouter.get("/", moviesController );
moviesRouter.get("/now-showing", moviesController );
moviesRouter.get("/upcoming", moviesController );

module.exports = moviesRouter;
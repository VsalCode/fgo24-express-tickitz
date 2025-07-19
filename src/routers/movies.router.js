const moviesRouter = require("express").Router(); 
const moviesController = require("../controllers/movies.controller");

moviesRouter.get("/", moviesController.getAllMovies );

module.exports = moviesRouter;
const moviesRouter = require("express").Router(); 
const moviesController = require("../controllers/movies.controller");

moviesRouter.get("/:id", moviesController.getMovieDetail );
moviesRouter.get("", moviesController.getAllMovies );
moviesRouter.get("/now-showing", moviesController.getNowShowingMovies );
moviesRouter.get("/genres", moviesController.getAllGenres );
moviesRouter.get("/directors", moviesController.getAllDirectors );
moviesRouter.get("/casts", moviesController.getAllCasts );

module.exports = moviesRouter;
const moviesRouter = require("express").Router(); 
const moviesController = require("../controllers/movies.controller");

moviesRouter.get("", moviesController.getAllMovies );
moviesRouter.get("/now-showing", moviesController.getNowShowingMovies );
moviesRouter.get("/upcoming", moviesController.getUpcomingMovies );
moviesRouter.get("/genres", moviesController.getAllGenres );
moviesRouter.get("/directors", moviesController.getAllDirectors );
moviesRouter.get("/casts", moviesController.getAllCasts );
moviesRouter.get("/:id", moviesController.getMovieDetail );

module.exports = moviesRouter;
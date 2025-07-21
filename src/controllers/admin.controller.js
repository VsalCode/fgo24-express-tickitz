const { constants: http } = require("http2");
const {
  movies,
  movie_casts: movieCasts,
  movie_directors: movieDirectors,
  movie_genres: movieGenres,
  genres,
  directors,
  casts,
} = require("../models");
const { sequelize } = require("../models");

exports.addNewMovie = async function (req, res) {
  const transaction = await sequelize.transaction();

  try {
    const userId = req.userId;
    const userRole = req.userRole;

    if (!userId || !userRole) {
      await transaction.rollback();
      return res.status(http.HTTP_STATUS_UNAUTHORIZED).json({
        success: false,
        message: "You Must Login or register!",
      });
    }

    if (userRole !== "admin") {
      await transaction.rollback();
      return res.status(http.HTTP_STATUS_FORBIDDEN).json({
        success: false,
        message: "You doesn't have access!",
      });
    }

    const {
      castIds: castIdsString,
      directorIds: directorIdsString,
      genreIds: genreIdsString,
      overview,
      releaseDate,
      runtime,
      title,
      voteAverage,
    } = req.body;

    let castIds, directorIds, genreIds;
    try {
      castIds = castIdsString ? JSON.parse(castIdsString) : [];
      directorIds = directorIdsString ? JSON.parse(directorIdsString) : [];
      genreIds = genreIdsString ? JSON.parse(genreIdsString) : [];
    } catch (parseError) {
      await transaction.rollback();
      return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message:
          "Invalid format for array fields. Use JSON arrays like [1,2,3]",
        errors: parseError.message,
      });
    }

    if (
      !castIds.length ||
      !directorIds.length ||
      !genreIds.length ||
      !overview ||
      !releaseDate ||
      !runtime ||
      !title ||
      !voteAverage
    ) {
      await transaction.rollback();
      return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "All fields are required and arrays cannot be empty!",
      });
    }

    if (
      !Array.isArray(castIds) ||
      !Array.isArray(directorIds) ||
      !Array.isArray(genreIds)
    ) {
      await transaction.rollback();
      return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "castIds, directorIds, and genreIds must be arrays",
      });
    }

    if (!req.files || !req.files["poster"] || !req.files["backdrop"]) {
      await transaction.rollback();
      return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "Both poster and backdrop files are required",
      });
    }

    const posterFile = req.files["poster"][0];
    const backdropFile = req.files["backdrop"][0];

    const posterFilename = posterFile.filename;
    const backdropFilename = backdropFile.filename;

    const newMovie = await movies.create(
      {
        backdrop_path: backdropFilename,
        overview,
        poster_path: posterFilename,
        release_date: releaseDate,
        runtime: parseInt(runtime, 10),
        title,
        vote_average: parseFloat(voteAverage),
      },
      { transaction }
    );

    const genreRecords = await genres.findAll({
      where: { id: genreIds },
      transaction,
    });

    if (genreRecords.length !== genreIds.length) {
      throw new Error("Some genre IDs are invalid");
    }

    const genreMovieRelations = genreIds.map((genreId) => ({
      movie_id: newMovie.id,
      genre_id: genreId,
    }));

    await movieGenres.bulkCreate(genreMovieRelations, { transaction });

    const castRecords = await casts.findAll({
      where: { id: castIds },
      transaction,
    });

    if (castRecords.length !== castIds.length) {
      throw new Error("Some cast IDs are invalid");
    }

    const castMovieRelations = castIds.map((castId) => ({
      movie_id: newMovie.id,
      cast_id: castId,
    }));

    await movieCasts.bulkCreate(castMovieRelations, { transaction });

    const directorRecords = await directors.findAll({
      where: { id: directorIds },
      transaction,
    });

    if (directorRecords.length !== directorIds.length) {
      throw new Error("Some director IDs are invalid");
    }

    const directorMovieRelations = directorIds.map((directorId) => ({
      movie_id: newMovie.id,
      director_id: directorId,
    }));

    await movieDirectors.bulkCreate(directorMovieRelations, { transaction });
    await transaction.commit();

    return res.status(http.HTTP_STATUS_CREATED).json({
      success: true,
      message: "Add new movie successfully!",
      results: {
        id: newMovie.id,
        title: newMovie.title,
        overview: newMovie.overview,
        backdrop_path: newMovie.backdrop_path,
        poster_path: newMovie.poster_path,
        release_date: newMovie.release_date,
        runtime: newMovie.runtime,
        vote_average: newMovie.vote_average,
        genres: genreRecords.map((genre) => ({
          id: genre.id,
          name: genre.name,
        })),
        casts: castRecords.map((cast) => ({
          id: cast.id,
          name: cast.name,
        })),
        directors: directorRecords.map((director) => ({
          id: director.id,
          name: director.name,
        })),
      },
    });
  } catch (error) {
    await transaction.rollback();

    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Failed to add new movie",
    });
  }
};

exports.updateMovie = async function (req, res) {
  const transaction = await sequelize.transaction();
  let isTransactionFinished = false;

  try {
    const userId = req.userId;
    const userRole = req.userRole;
    const movieId = req.params.id;

    if (!userId || !userRole) {
      return res.status(http.HTTP_STATUS_UNAUTHORIZED).json({
        success: false,
        message: "You Must Login or register!",
      });
    }

    if (userRole !== "admin") {
      return res.status(http.HTTP_STATUS_FORBIDDEN).json({
        success: false,
        message: "You doesn't have access!",
      });
    }

    const {
      castIds: castIdsString,
      directorIds: directorIdsString,
      genreIds: genreIdsString,
      overview,
      releaseDate,
      runtime,
      title,
      voteAverage,
      backdrop_path,
      poster_path,
    } = req.body;

    let castIds = castIdsString ? JSON.parse(castIdsString) : null;
    let directorIds = directorIdsString ? JSON.parse(directorIdsString) : null;
    let genreIds = genreIdsString ? JSON.parse(genreIdsString) : null;

    const movie = await movies.findByPk(movieId, { 
      transaction,
      include: [
        { model: genres, as: 'genres' },
        { model: casts, as: 'casts' },
        { model: directors, as: 'directors' }
      ]
    });

    if (!movie) {
      await transaction.rollback();
      isTransactionFinished = true;
      return res.status(http.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "Movie not found!",
      });
    }

    await movie.update({
      overview,
      release_date: releaseDate,
      runtime,
      title,
      vote_average: voteAverage,
      backdrop_path,
      poster_path,
    }, { transaction });

    if (castIds) {
      await movie.setCasts(castIds, { transaction });
    }

    if (directorIds) {
      await movie.setDirectors(directorIds, { transaction });
    }

    if (genreIds) {
      await movie.setGenres(genreIds, { transaction });
    }

    await transaction.commit();
    isTransactionFinished = true;

    await movie.reload({
      include: [
        { model: genres, as: 'genres' },
        { model: casts, as: 'casts' },
        { model: directors, as: 'directors' }
      ],
    });

    return res.status(http.HTTP_STATUS_OK).json({
      success: true,
      message: "Movie updated successfully!",
      results: {
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        backdrop_path: movie.backdrop_path,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
        runtime: movie.runtime,
        vote_average: movie.vote_average,
        genres: movie.genres.map(genre => ({
          id: genre.id,
          name: genre.name
        })),
        casts: movie.casts.map(cast => ({
          id: cast.id,
          name: cast.name
        })),
        directors: movie.directors.map(director => ({
          id: director.id,
          name: director.name
        }))
      },
    });

  } catch (error) {
    if (!isTransactionFinished) {
      await transaction.rollback();
    }

    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to request update movie",
      errors: error.message
    });
  }
};

exports.deleteMovie = async function (req, res) {
  try {
    const userId = req.userId;
    const userRole = req.userRole;

    if (!userId || !userRole) {
      return res.status(http.HTTP_STATUS_UNAUTHORIZED).json({
        success: false,
        message: "You Must Login or register!",
      });
    }

    if (userRole !== "admin") {
      return res.status(http.HTTP_STATUS_FORBIDDEN).json({
        success: false,
        message: "You don't have access!",
      });
    }

    const movieIdParams = req.params.id;
    
    if (!movieIdParams || isNaN(movieIdParams)) {
      return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "Invalid movie ID provided",
      });
    }

    const movieIdInt = parseInt(movieIdParams);
    
    const existingMovie = await movies.findByPk(movieIdInt);
    if (!existingMovie) {
      return res.status(http.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "Movie not found",
      });
    }

    const deletedCount = await movies.destroy({
      where: { id: movieIdInt },
    });

    if (deletedCount === 0) {
      return res.status(http.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "Movie not found or already deleted",
      });
    }

    return res.status(http.HTTP_STATUS_OK).json({
      success: true,
      message: `Movie with id ${movieIdInt} deleted successfully`,
    });

  } catch (err) {
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: err.message || "Failed to delete movie",
    });
  }
};
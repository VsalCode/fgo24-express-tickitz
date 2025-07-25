const { constants: http } = require("http2");
const { movies, genres, directors, casts, sequelize } = require("../models");
const { validationResult } = require("express-validator");

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

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await transaction.rollback();
      return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "Validation failed.",
        errors: errors.array(),
      });
    }

     let castIds = castIdsString ? JSON.parse(castIdsString) : [];
    let directorIds = directorIdsString ? JSON.parse(directorIdsString) : [];
    let genreIds = genreIdsString ? JSON.parse(genreIdsString) : [];

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
        runtime: runtime,
        title,
        vote_average: voteAverage,
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

    await newMovie.addGenres(genreIds, { transaction });

    const castRecords = await casts.findAll({
      where: { id: castIds },
      transaction,
    });

    if (castRecords.length !== castIds.length) {
      throw new Error("Some cast IDs are invalid");
    }

    await newMovie.addCasts(castIds, { transaction });

    const directorRecords = await directors.findAll({
      where: { id: directorIds },
      transaction,
    });

    if (directorRecords.length !== directorIds.length) {
      throw new Error("Some director IDs are invalid");
    }

    await newMovie.addDirectors(directorIds, { transaction });
    await transaction.commit();

    await newMovie.reload({
      include: [
        { model: genres, as: "genres" },
        { model: casts, as: "casts" },
        { model: directors, as: "directors" },
      ],
    });

    return res.status(http.HTTP_STATUS_CREATED).json({
      success: true,
      message: "Add new movie successfully!",
      results: {
        ...newMovie.toJSON(),
        genres: newMovie.genres.map((genre) => ({
          id: genre.id,
          name: genre.name,
        })),
        casts: newMovie.casts.map((cast) => ({
          id: cast.id,
          name: cast.name,
        })),
        directors: newMovie.directors.map((director) => ({
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
        { model: genres, as: "genres" },
        { model: casts, as: "casts" },
        { model: directors, as: "directors" },
      ],
    });

    if (!movie) {
      await transaction.rollback();
      isTransactionFinished = true;
      return res.status(http.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "Movie not found!",
      });
    }

    await movie.update(
      {
        overview,
        release_date: releaseDate,
        runtime,
        title,
        vote_average: voteAverage,
        backdrop_path,
        poster_path,
      },
      { transaction }
    );

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
        { model: genres, as: "genres" },
        { model: casts, as: "casts" },
        { model: directors, as: "directors" },
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
        genres: movie.genres.map((genre) => ({
          id: genre.id,
          name: genre.name,
        })),
        casts: movie.casts.map((cast) => ({
          id: cast.id,
          name: cast.name,
        })),
        directors: movie.directors.map((director) => ({
          id: director.id,
          name: director.name,
        })),
      },
    });
  } catch (error) {
    if (!isTransactionFinished) {
      await transaction.rollback();
    }

    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to request update movie",
      errors: error.message,
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

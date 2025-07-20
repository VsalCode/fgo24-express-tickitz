const { constants: http } = require("http2");
const {
  movies,
  movie_casts,
  movie_directors,
  movie_genres,
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
        message: "Invalid format for array fields. Use JSON arrays like [1,2,3]",
        errors: parseError.message
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

    if (!Array.isArray(castIds) || !Array.isArray(directorIds) || !Array.isArray(genreIds)) {
      await transaction.rollback();
      return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "castIds, directorIds, and genreIds must be arrays",
      });
    }

    if (!req.files || !req.files['poster'] || !req.files['backdrop']) {
      await transaction.rollback();
      return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "Both poster and backdrop files are required",
      });
    }

    const posterFile = req.files['poster'][0];
    const backdropFile = req.files['backdrop'][0];

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

    await movie_genres.bulkCreate(genreMovieRelations, { transaction });

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

    await movie_casts.bulkCreate(castMovieRelations, { transaction });

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

    await movie_directors.bulkCreate(directorMovieRelations, { transaction });
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

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

    console.log(userId);
    console.log(userRole);

    if (!userId || !userRole) {
      return res.status(http.HTTP_STATUS_UNAUTHORIZED).json({
        success: false,
        message: "You Must Login or register!",
      });
    }

    if (userRole != "admin") {
      return res.status(http.HTTP_STATUS_FORBIDDEN).json({
        success: false,
        message: "You doesnt have access!",
      });
    }

    const {
      backdropPath,
      castIds, 
      directorIds, 
      genreIds, 
      overview,
      posterPath,
      releaseDate,
      runtime,
      title,
      voteAverage,
    } = req.body;

    if (
      !backdropPath ||
      !castIds ||
      !directorIds ||
      !genreIds ||
      !overview ||
      !posterPath ||
      !releaseDate ||
      !runtime ||
      !title ||
      !voteAverage
    ) {
      return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "All fields are required!",
      });
    }

    const newMovie = await movies.create(
      {
        backdrop_path: backdropPath,
        overview,
        poster_path: posterPath,
        release_date: releaseDate,
        runtime,
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

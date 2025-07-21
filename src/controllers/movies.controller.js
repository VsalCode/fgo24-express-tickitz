const { constants: http } = require("http2");
const { movies, genres, directors, casts } = require("../models");

exports.getAllMovies = async function (_, res) {
  try {
    const moviesData = await movies.findAll({
      include: [
        { model: genres, as: 'genres' },
        { model: casts, as: 'casts' },
        { model: directors, as: 'directors' }
      ]
    });

    return res.status(http.HTTP_STATUS_OK).json({
      success: true,
      message: "Get all movies successfully!",
      results: moviesData.map(movie => ({
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
      }))
    });

  } catch (err) {
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to retrieve movies",
      errors: err.message,
    });
  }
};

exports.getAllGenres = async function (_, res) {
  try {
    const getGenres = await genres.findAll();
    if (!getGenres) {
      return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "Failed while get all genres!",
      });
    }

    return res.status(http.HTTP_STATUS_OK).json({
      success: true,
      message: "Success to get all genres!",
      results: getGenres,
    });
  } catch (err) {
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to get all genres!",
      errors: err.message,
    });
  }
};

exports.getAllCasts = async function (_, res) {
  try {
    const getCasts = await casts.findAll();
    if (!getCasts) {
      return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "Failed while get all Casts!",
      });
    }

    return res.status(http.HTTP_STATUS_OK).json({
      success: true,
      message: "Success to get all Casts!",
      results: getCasts,
    });
  } catch (err) {
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to get all Casts!",
      errors: err.message,
    });
  }
};

exports.getAllDirectors = async function (_, res) {
  try {
    const getDirectors = await directors.findAll();
    if (!getDirectors) {
      return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "Failed while get all Directors!",
      });
    }

    return res.status(http.HTTP_STATUS_OK).json({
      success: true,
      message: "Success to get all Directors!",
      results: getDirectors,
    });
  } catch (err) {
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to get all Directors!",
      errors: err.message,
    });
  }
};

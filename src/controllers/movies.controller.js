const { constants: http } = require("http2");
const { movies, genres, directors, casts, Sequelize } = require("../models");
const { Op } = require("sequelize");
const { redisClient, ensureConnection } = require('../lib/redis'); 

exports.getAllMovies = async function (req, res) {
  try {
    await ensureConnection();

    const search = req.query.search || '';
    const filterByGenre = req.query.filter || '';
    const limit = req.query.limit || 10;
    const offset = req.query.offset || 0;
    const sortBy = req.query.sortBy || 'created_at_asc';

    const cacheKey = `movies:`;

    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      console.log('Serving from cache:', cacheKey);
      return res.status(http.HTTP_STATUS_OK).json({
        success: true,
        message: "Get all movies successfully from cache!",
        results: JSON.parse(cachedData),
      });
    }

    let order = [];

    if (sortBy) {
      if (sortBy === "highest_rating") {
        order.push(["vote_average", "DESC"]);
      } else if (sortBy === "lowest_rating") {
        order.push(["vote_average", "ASC"]);
      } else if (sortBy === "title_asc") {
        order.push([Sequelize.fn("LOWER", Sequelize.col("title")), "ASC"]);
      } else if (sortBy === "title_desc") {
        order.push([Sequelize.fn("LOWER", Sequelize.col("title")), "DESC"]);
      } else if (sortBy == "popularity") {
        order.push(["popularity", "DESC"]);
      } else if (sortBy == "created_at_asc") {
        order.push(['created_at', 'ASC']);
      }
    }

    const moviesData = await movies.findAll({
      include: [
        {
          model: genres,
          as: "genres",
          where: filterByGenre ? { id: parseInt(filterByGenre) } : {},
          required: !!filterByGenre,
        },
        { model: casts, as: "casts" },
        { model: directors, as: "directors" },
      ],
      where: {
        ...(search && { title: { [Op.iLike]: `%${search}%` } }),
      },
      order: order.length > 0 ? order : [['created_at', 'ASC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    const formattedMoviesData = moviesData.map((movie) => ({
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      backdrop_path: movie.backdrop_path,
      poster_path: movie.poster_path,
      release_date: movie.release_date,
      runtime: movie.runtime,
      vote_average: movie.vote_average,
      popularity: movie.popularity,
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
    }));

    await redisClient.setEx(cacheKey, 3600, JSON.stringify(formattedMoviesData));

    return res.status(http.HTTP_STATUS_OK).json({
      success: true,
      message: "Get all movies successfully!",
      results: formattedMoviesData,
    });

  } catch (err) {
    console.error("Error in getAllMovies:", err);
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to retrieve movies",
      errors: err.message,
    });
  }
};


exports.getMovieDetail = async function (req, res) {
  try {
    const movieIdParams = req.params.id;
    const movieId = parseInt(movieIdParams);

    const moviesData = await movies.findAll(
      {
        include: [
          { model: genres, as: "genres" },
          { model: casts, as: "casts" },
          { model: directors, as: "directors" },
        ],
      },
      { where: { id: movieId } }
    );
    if (!moviesData) {
      return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
        success: false,
        message: `movies with id ${movieId} not found!`,
      });
    }

    const movie = moviesData[0];

    return res.status(http.HTTP_STATUS_OK).json({
      success: true,
      message: `Get movies with id ${movieId} successfully!`,
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
  } catch (err) {
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to retrieve movie detail",
      errors: err.message,
    });
  }
};

exports.getNowShowingMovies = async function (_, res) {
  try {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(today.getMonth() - 2);
    twoMonthsAgo.setHours(0, 0, 0, 0);

    const moviesData = await movies.findAll({
      where: {
        release_date: {
          [Op.gte]: twoMonthsAgo,
          [Op.lte]: today,
        },
      },
      include: [
        { model: genres, as: "genres" },
        { model: casts, as: "casts" },
        { model: directors, as: "directors" },
      ],
      order: [["release_date", "DESC"]],
    });

    return res.status(http.HTTP_STATUS_OK).json({
      success: true,
      message: "Get now showing movies successfully!",
      results: moviesData.map((movie) => ({
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
      })),
    });
  } catch (err) {
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to retrieve now showing movies",
      errors: err.message,
    });
  }
};

exports.getUpcomingMovies = async function (_, res) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const moviesData = await movies.findAll({
      include: [
        { model: genres, as: "genres" },
        { model: casts, as: "casts" },
        { model: directors, as: "directors" },
      ],
      where: {
        release_date: {
          [Op.gt]: today,
        },
      },
      order: [["release_date", "ASC"]],
    });

    return res.status(http.HTTP_STATUS_OK).json({
      success: true,
      message: "Get all movies successfully!",
      results: moviesData.map((movie) => ({
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
      })),
    });
  } catch (err) {
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to retrieve now showing movies",
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

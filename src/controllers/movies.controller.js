const { constants: http } = require("http2");
const { movies } = require('../models');

exports.getAllMovies = async function (req, res){
  try {

    const films = await movies.findAll();

    return res.status(http.HTTP_STATUS_OK).json({
      success: true,
      message: "get all movies successfully!",
      results: films
    });

  } catch(err) {
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "failed to get all movies!",
      errors: err.message,
    });

  };
};
const { constants: http } = require("http2");
const { genres, directors, casts } = require("../models");

exports.getAllGenres = async function (_, res){
  try {
    const getGenres = await genres.findAll();
    if(!getGenres){
      return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "Failed while get all genres!",
      });  
    }

    return res.status(http.HTTP_STATUS_OK).json({
      success: true,
      message: "Success to get all genres!",
      results: getGenres
    });

  } catch(err) {
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to get all genres!",
      errors: err.message,
    });
  }
};

exports.getAllCasts = async function (_, res){
  try {
    const getCasts = await casts.findAll();
    if(!getCasts){
      return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "Failed while get all Casts!",
      });  
    }

    return res.status(http.HTTP_STATUS_OK).json({
      success: true,
      message: "Success to get all Casts!",
      results: getCasts
    });

  } catch(err) {
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to get all Casts!",
      errors: err.message,
    });
  }
};

exports.getAllDirectors = async function (_, res){
  try {
    const getDirectors = await directors.findAll();
    if(!getDirectors){
      return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "Failed while get all Directors!",
      });  
    }

    return res.status(http.HTTP_STATUS_OK).json({
      success: true,
      message: "Success to get all Directors!",
      results: getDirectors
    });

  } catch(err) {
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to get all Directors!",
      errors: err.message,
    });
  }
};
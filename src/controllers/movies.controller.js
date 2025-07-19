const { constants: http } = require("http2");
const models = require('../models');

exports.getAllMovies = function (req, res){
  // try {
    console.log('All exports:', Object.keys(models));

    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: true,
      message: "get all movies successfully!",
    });

  // } catch(err) {
  //   return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
  //     success: false,
  //     message: "failed to get all movies!",
  //     errors: err.message,
  //   })
  // }
};
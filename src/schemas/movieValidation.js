const { checkSchema } = require("express-validator");

const movieSchema = checkSchema({
  castIds: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'Cast IDs are required.',
    },
    isString: {
      errorMessage: 'Cast IDs must be a JSON string.',
    },
  },
  directorIds: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'Director IDs are required.',
    },
    isString: {
      errorMessage: 'Director IDs must be a JSON string.',
    },
  },
  genreIds: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'Genre IDs are required.',
    },
    isString: {
      errorMessage: 'Genre IDs must be a JSON string.',
    },
  },
  overview: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'Overview is required.',
    },
    isString: {
      errorMessage: 'Overview must be a string.',
    },
  },
  releaseDate: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'Release Date is required.',
    },
    isISO8601: {
      errorMessage: 'Release Date must be a valid date in YYYY-MM-DD format.',
    },
    toDate: true,
  },
  runtime: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'Runtime is required.',
    },
    isNumeric: {
      errorMessage: 'Runtime must be a number.',
    },
    toInt: true,
  },
  title: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'Title is required.',
    },
    isString: {
      errorMessage: 'Title must be a string.',
    },
  },
  voteAverage: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'Vote Average is required.',
    },
    isFloat: {
      errorMessage: 'Vote Average must be a floating-point number.',
    },
    toFloat: true,
  },
});

module.exports = movieSchema;

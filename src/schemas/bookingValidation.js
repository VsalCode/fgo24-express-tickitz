const { checkSchema } = require("express-validator");

const bookingSchema = checkSchema({
  amount: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'Amount is required.',
    },
    isNumeric: {
      errorMessage: 'Amount must be a number.',
    },
    toFloat: true
  },
  cinema: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'Cinema is required.',
    },
    isString: {
      errorMessage: 'Cinema must be a string.',
    }
  },
  customerFullname: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'Customer Fullname is required.',
    },
    isString: {
      errorMessage: 'Customer Fullname must be a string.',
    }
  },
  customerEmail: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'Customer Email is required.',
    },
    isEmail: {
      errorMessage: 'Customer Email is not valid.',
    }
  },
  customerPhone: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'Customer Phone is required.',
    },
    isString: {
      errorMessage: 'Customer Phone must be a string.',
    }
  },
  location: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'Location is required.',
    },
    isString: {
      errorMessage: 'Location must be a string.',
    }
  },
  movieId: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'Movie ID is required.',
    },
    isNumeric: {
      errorMessage: 'Movie ID must be a number.',
    },
    toInt: true
  },
  paymentMethodId: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'Payment Method ID is required.',
    },
    isNumeric: {
      errorMessage: 'Payment Method ID must be a number.',
    },
    toInt: true
  },
  showDate: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'Show Date is required.',
    },
    isISO8601: {
      errorMessage: 'Show Date must be a valid date in YYYY-MM-DD format.',
    },
    toDate: true
  },
  showTime: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'Show Time is required.',
    },
    isString: {
      errorMessage: 'Show Time must be a string.',
    }
  },
  seats: {
    in: ['body'],
    isArray: {
      errorMessage: 'Seats must be an array.',
    },
    notEmpty: {
      errorMessage: 'Seats array cannot be empty.',
    },
  },
});

module.exports = bookingSchema;
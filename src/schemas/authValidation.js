const { checkSchema } = require("express-validator");

exports.register = checkSchema({
  email: {
    in: ["body"],
    isEmail: {
      errorMessage: "Invalid email address.",
    },
    notEmpty: {
      errorMessage: "Email is required.",
    },
    normalizeEmail: true, 
  },
  password: {
    in: ["body"],
    isLength: {
      options: { min: 6 },
      errorMessage: "Password must be at least 6 characters long.",
    },
    notEmpty: {
      errorMessage: "Password is required.",
    },
  },
  confirmPassword: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Confirm password is required.",
    },
    custom: {
      options: (value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Password and confirm password do not match.");
        }
        return true;
      },
      errorMessage: "Password and confirm password do not match.",
    },
  },
});

exports.login = checkSchema({
  email: {
    in: ["body"],
    isEmail: {
      errorMessage: "Invalid email address.",
    },
    notEmpty: {
      errorMessage: "Email is required.",
    },
    normalizeEmail: true,
  },
  password: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Password is required.",
    },
  },
});


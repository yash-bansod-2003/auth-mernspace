import { checkSchema } from "express-validator";

// export const registerValidator = [
//       body("email").notEmpty().isEmail().trim().withMessage("Email is required"),
//       body("password").notEmpty().withMessage("Password is required"),
// ];

export const registerValidator = checkSchema({
  firstName: {
    errorMessage: "firstName is required",
    notEmpty: true,
    trim: true,
  },
  lastName: {
    errorMessage: "lastName is required",
    notEmpty: true,
    trim: true,
  },
  email: {
    errorMessage: "Email is required",
    notEmpty: true,
    trim: true,
  },
  password: {
    errorMessage: "Password is required",
    notEmpty: true,
    isLength: {
      options: {
        min: 4,
      },
      errorMessage: "password length should be 8 characters.",
    },
  },
});

export const loginValidator = checkSchema({
  email: {
    errorMessage: "email is required",
    notEmpty: true,
    trim: true,
    isEmail: {
      errorMessage: "email should be a valid email",
    },
  },
  password: {
    errorMessage: "password is required",
    notEmpty: true,
  },
});

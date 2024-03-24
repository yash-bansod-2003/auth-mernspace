import { checkSchema } from "express-validator";

export const userCreateValidator = checkSchema({
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
  role: {
    errorMessage: "role is required",
    notEmpty: true,
    trim: true,
  },
  tenantId: {
    errorMessage: "tanantId is required",
    notEmpty: true,
    trim: true,
    isNumeric: true,
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

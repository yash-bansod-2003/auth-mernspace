import { checkSchema } from "express-validator";

// export const registerValidator = [
//       body("email").notEmpty().isEmail().trim().withMessage("Email is required"),
//       body("password").notEmpty().withMessage("Password is required"),
// ];

export const registerValidator = checkSchema({
  email: {
    errorMessage: "Email is required",
    notEmpty: true,
    trim: true,
  },
  password: {
    errorMessage: "Password is required",
    notEmpty: true,
  },
});

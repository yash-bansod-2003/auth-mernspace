import { checkSchema } from "express-validator";

export const tenentCreateValidator = checkSchema({
  name: {
    errorMessage: "Name is required",
    notEmpty: true,
    trim: true,
  },
  address: {
    errorMessage: "Address is required",
    notEmpty: true,
  },
});

export const tenantSearchQueryValidator = checkSchema(
  {
    page: {
      customSanitizer: {
        options: (value) => {
          return Number.isNaN(Number(value)) ? 1 : Number(value);
        },
      },
    },
    limit: {
      customSanitizer: {
        options: (value) => {
          return Number.isNaN(Number(value)) ? 10 : Number(value);
        },
      },
    },
  },
  ["query"],
);

import Joi from "joi";
import { PERMISSION } from "../constants/permissions";

export const createUserBodySchema = Joi.object({
     name: Joi.string().required().messages({
          "any.required": "name is required",
     }),

     email: Joi.string().email().required().messages({
          "any.required": "email is required",
          "string.email": "Email must be in valid format",
     }),

     password: Joi.string()
          .required()
          .min(8)
          .messages({
               "string.base": "Password must be string",
               "any.required": "password is required",
               "string.min": "Password must be at least 8 characters",
               "password.uppercase":
                    "Password must have atleast one uppercase character",
               "password.lowercase":
                    "Password must have at least one lowercase character",
               "password.special":
                    "Password must have at least one special character",
          })
          .custom((value, helpers) => {
               if (!/[A-Z]/.test(value)) {
                    return helpers.error("password.uppercase");
               }
               if (!/[a-z]/.test(value)) {
                    return helpers.error("password.lowercase");
               }
               if (!/[!@#$%^&*()_+]/.test(value)) {
                    return helpers.error("password.special");
               }

               return value;
          }),

     permission: Joi.string().optional().default(PERMISSION.USER).messages({
          "string.base": "Permissions must be  string ",
     }),
}).options({
     stripUnknown: true,
});

export const updateUserBodySchema = Joi.object({
     name: Joi.string().optional(),

     email: Joi.string().email().optional().messages({
          "string.email": "Email must be in valid format",
     }),

     password: Joi.string()
          .optional()
          .min(8)
          .messages({
               "string.base": "Password must be string",
               "string.min": "Password must be at least 8 characters",
               "password.uppercase":
                    "Password must have atleast one uppercase character",
               "password.lowercase":
                    "Password must have at least one lowercase character",
               "password.special":
                    "Password must have at least one special character",
          })
          .custom((value, helpers) => {
               if (!/[A-Z]/.test(value)) {
                    return helpers.error("password.uppercase");
               }
               if (!/[a-z]/.test(value)) {
                    return helpers.error("password.lowercase");
               }
               if (!/[!@#$%^&*()_+]/.test(value)) {
                    return helpers.error("password.special");
               }

               return value;
          }),

     permission: Joi.string()
          .optional()
          .messages({
               "string.base": "Permissions must be  string ",
          })
          .options({
               stripUnknown: true,
          }),
});

export const GetUserQuerySchema = Joi.object({
     q: Joi.string().optional(),
     page: Joi.number()
          .min(1)
          .optional()
          .messages({
               "number.base": "page must be a number",
               "number.min": "page must be greater than or equal to 1",
          })
          .default(1),

     size: Joi.number()
          .min(1)
          .max(5)
          .optional()
          .messages({
               "number.base": "page must be a number",
               "number.min": "size must be greater than or equal to 1",
               "number.max": "size must be less than or equal to 9",
          })
          .default(5),
}).options({
     stripUnknown: true,
});

import Joi from "joi";

export const LoginSchema = Joi.object({
     email: Joi.string().email().required().messages({
          "string.email": "email must be in valid format",
          "any.required": "email is required",
     }),

     password: Joi.string().required().messages({
          "any.required": "password is required",
     }),
});

export const RefreshSchema = Joi.object({
     refreshToken: Joi.string().required().messages({
          "any.required": "RefreshToken is required",
     }),
});

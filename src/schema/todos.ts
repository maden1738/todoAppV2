import Joi from "joi";

export const createTodosBodySchema = Joi.object({
     todo: Joi.string().required().messages({
          "any.required": "Todo  is required",
     }),

     status: Joi.string().optional().default("incomplete"),

     dueDate: Joi.date()
          .optional()
          .default(() => new Date())
          .messages({
               "date.base": "Invalid date format",
          }),
}).options({
     stripUnknown: true,
});

export const updateTodosBodySchema = Joi.object({
     todo: Joi.string().optional(),

     status: Joi.string().optional(),

     dueDate: Joi.date().optional(),
}).options({
     stripUnknown: true,
});

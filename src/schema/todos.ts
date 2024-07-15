import Joi from "joi";

export const createTodosBodySchema = Joi.object({
     todo: Joi.string().required().messages({
          "any.required": "Todo  is required",
     }),

     status: Joi.string()
          .required()
          .default("incomplete")
          .messages({
               "status.invalid":
                    "Status can only be either 'completed' or 'incomplete'",
          })
          .custom((value, helpers) => {
               if (value !== "incomplete" && value !== "completed") {
                    return helpers.error("status.invalid");
               }
          }),

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

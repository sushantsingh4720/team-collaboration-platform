const Joi = require("joi");
const objectIdValidator = require("./objectId");

const createTaskValidation = (body) => {
  const schema = Joi.object({
    title: Joi.string().min(1).max(200).required().trim().messages({
      "string.base": "Task title must be a valid text string",
      "string.empty": "Task title cannot be empty",
      "string.min": "Task title must be at least 1 character long",
      "string.max": "Task title cannot exceed 200 characters",
      "any.required": "Task title is required to create a task",
    }),

    description: Joi.string()
      .max(2000)
      .allow("", null)
      .trim()
      .default("")
      .messages({
        "string.base": "Description must be a valid text string",
        "string.max": "Description cannot exceed 2000 characters",
      }),

    status: Joi.string()
      .valid("todo", "in-progress", "done")
      .lowercase()
      .default("todo")
      .messages({
        "string.base": "Status must be a valid text string",
        "any.only": "Status must be one of: todo, in-progress, or done",
        "any.required": "Status is required",
      }),

    projectId: Joi.string()
      .custom(objectIdValidator, "MongoDB ObjectId validation")
      .required()
      .messages({
        "string.base": "Project ID must be a valid string",
        "string.empty": "Project ID cannot be empty",
        "any.invalid": "Project ID must be a valid MongoDB identifier",
        "any.required": "Project ID is required to create a task",
      }),

    assignedTo: Joi.string()
      .custom(objectIdValidator, "MongoDB ObjectId validation")
      .allow(null, "")
      .default(null)
      .messages({
        "string.base": "Assigned To must be a valid string",
        "any.invalid": "Assigned To must be a valid MongoDB identifier",
      }),
  })
    .strict()
    .messages({
      "object.unknown":
        'Field "{{#label}}" is not allowed in the task creation request',
    });

  return schema.validate(body, { abortEarly: true });
};

module.exports = createTaskValidation;

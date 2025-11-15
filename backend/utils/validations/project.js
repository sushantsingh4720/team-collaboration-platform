const Joi = require("joi");
const objectIdValidator = require("./objectId");

const createProjectValidation = (body) => {
  const schema = Joi.object({
    name: Joi.string().min(1).max(100).required().trim().messages({
      "string.base": "Project name must be a valid text string",
      "string.empty": "Project name cannot be empty",
      "string.min": "Project name must be at least 1 character long",
      "string.max": "Project name cannot exceed 100 characters",
      "any.required": "Project name is required to create a project",
    }),

    description: Joi.string()
      .max(1000)
      .allow("", null)
      .trim()
      .default("")
      .messages({
        "string.base": "Description must be a valid text string",
        "string.max": "Description cannot exceed 1000 characters",
      }),

    teamId: Joi.string()
      .custom(objectIdValidator, "MongoDB ObjectId validation")
      .required()
      .messages({
        "string.base": "Team ID must be a valid string",
        "string.empty": "Team ID cannot be empty",
        "any.invalid": "Team ID must be a valid MongoDB identifier",
        "any.required": "Team ID is required to create a project",
      }),
  })
    .strict()
    .messages({
      "object.unknown":
        'Field "{{#label}}" is not allowed in the project creation request',
    });

  return schema.validate(body, { abortEarly: true });
};

module.exports = { createProjectValidation };

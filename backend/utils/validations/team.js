const Joi = require("joi");
const objectIdValidator = require("./objectId");

const createTeamValidation = (body) => {
  const schema = Joi.object({
    name: Joi.string().min(1).max(100).required().trim().messages({
      "string.base": "Team name must be a valid text string",
      "string.empty": "Team name cannot be empty",
      "string.min": "Team name must be at least 1 character long",
      "string.max": "Team name cannot exceed 100 characters",
      "any.required": "Team name is required to create a team",
    }),

    description: Joi.string()
      .max(500)
      .allow("", null)
      .trim()
      .default("")
      .messages({
        "string.base": "Description must be a valid text string",
        "string.max": "Description cannot exceed 500 characters",
      }),

    adminId: Joi.string()
      .custom(objectIdValidator, "MongoDB ObjectId validation")
      .required()
      .messages({
        "string.base": "Admin ID must be a valid string",
        "string.empty": "Admin ID cannot be empty",
        "any.invalid": "Admin ID must be a valid MongoDB identifier",
        "any.required": "Admin ID is required to create a team",
      }),
  })
    .strict()
    .messages({
      "object.unknown":
        'Field "{{#label}}" is not allowed in the team creation request',
    });

  return schema.validate(body, { abortEarly: true });
};

module.exports = { createTeamValidation };

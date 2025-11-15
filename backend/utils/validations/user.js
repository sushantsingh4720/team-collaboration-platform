const Joi = require("joi");
const objectIdValidator = require("./objectId");

const createUserValidation = (body) => {
  const schema = Joi.object({
    email: Joi.string()
      .email()
      .required()
      .trim()
      .lowercase()
      .max(255)
      .messages({
        "string.base": "Email must be a valid text string",
        "string.empty": "Email address cannot be empty",
        "string.email":
          "Please provide a valid email address (e.g., name@example.com)",
        "string.max": "Email address cannot exceed 255 characters",
        "any.required": "Email address is required to create an account",
      }),

    name: Joi.string().min(1).max(100).required().trim().messages({
      "string.base": "Full name must be a valid text string",
      "string.empty": "Full name cannot be empty",
      "string.min": "Full name must be at least 2 characters long",
      "string.max": "Full name cannot exceed 100 characters",
      "any.required": "Full name is required to create an account",
    }),

    role: Joi.string()
      .valid("ADMIN", "MANAGER", "MEMBER")
      .uppercase()
      .default("MEMBER")
      .messages({
        "string.base": "Role must be a valid text string",
        "any.only": "Role must be one of: ADMIN, MANAGER, or MEMBER",
        "any.required": "Role is required",
      }),

    teamId: Joi.string()
      .custom(objectIdValidator, "MongoDB ObjectId validation")
      .allow(null, "")
      .default(null)
      .messages({
        "any.invalid": "Team ID must be a valid MongoDB identifier",
        "string.base": "Team ID must be a valid string",
      }),
  })
    .strict()
    .messages({
      "object.unknown":
        'Field "{{#label}}" is not allowed in the user creation request',
    });

  return schema.validate(body, { abortEarly: true });
};

module.exports = { createUserValidation };

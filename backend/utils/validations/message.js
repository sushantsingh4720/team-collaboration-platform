const Joi = require("joi");
const objectIdValidator = require("./objectId");

const createMessageValidation = (body) => {
  const schema = Joi.object({
    content: Joi.string().min(1).max(5000).required().trim().messages({
      "string.base": "Message content must be a valid text string",
      "string.empty": "Message content cannot be empty",
      "string.min": "Message content must be at least 1 character long",
      "string.max": "Message content cannot exceed 5000 characters",
      "any.required": "Message content is required to send a message",
    }),

    senderId: Joi.string()
      .custom(objectIdValidator, "MongoDB ObjectId validation")
      .required()
      .messages({
        "string.base": "Sender ID must be a valid string",
        "string.empty": "Sender ID cannot be empty",
        "any.invalid": "Sender ID must be a valid MongoDB identifier",
        "any.required": "Sender ID is required to send a message",
      }),

    teamId: Joi.string()
      .custom(objectIdValidator, "MongoDB ObjectId validation")
      .required()
      .messages({
        "string.base": "Team ID must be a valid string",
        "string.empty": "Team ID cannot be empty",
        "any.invalid": "Team ID must be a valid MongoDB identifier",
        "any.required": "Team ID is required to send a message",
      }),

    timestamp: Joi.date().default(Date.now).messages({
      "date.base": "Timestamp must be a valid date",
    }),
  })
    .strict()
    .messages({
      "object.unknown":
        'Field "{{#label}}" is not allowed in the message creation request',
    });

  return schema.validate(body, { abortEarly: true });
};

module.exports = createMessageValidation;

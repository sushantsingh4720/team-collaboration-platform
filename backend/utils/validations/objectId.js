const { Types } = require("mongoose");

const objectIdValidator = (value, helpers) => {
  if (value && !Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};

module.exports = objectIdValidator;

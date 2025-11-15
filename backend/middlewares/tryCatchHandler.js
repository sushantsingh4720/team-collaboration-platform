const throwError = require("./throwError");

const tryCatchHandler =
  (fn) =>
  (...args) => {
    try {
      const result = fn(...args);
      if (result instanceof Promise) {
        return result.catch((error) => {
          throwError(
            error?.status || 500,
            error?.message || "Internal Server Error"
          );
        });
      }
      return result;
    } catch (error) {
      throwError(
        error?.status || 500,
        error?.message || "Internal Server Error"
      );
    }
  };

module.exports = tryCatchHandler;

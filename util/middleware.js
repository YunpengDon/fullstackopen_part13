const logger = require("./logger");

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
  console.log(error);

  logger.error(error.message);
  if (error.name === "SequelizeValidationError") {
    return error.errors
      ? response.status(400).send({ error: error.errors.map((e) => e.message) })
      : response.status(400).send({ error: error.message });
  } else if (error.name === "SyntaxError") {
    return response.status(400).json({ error: error.message });
  } else if (error.name === "SequelizeUniqueConstraintError") {
    return response.status(400).json({ error: error.errors[0].message });
  } else if (error.name === "SequelizeDatabaseError") {
    return response.status(401).json({ error: error.message });
  } else if (error.name === "NotFound") {
    return response.status(404).json({ error: error.message });
  } else {
    return response.status(500).json({
      error: error.message || "unknown error",
    });
  }
};

module.exports = {
  unknownEndpoint,
  errorHandler,
};

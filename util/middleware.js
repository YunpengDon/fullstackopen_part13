const jwt = require("jsonwebtoken");
const logger = require("./logger");
const { SECRET } = require("./config");
const { Session } = require("../models");

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
  } else if (error.name === "Unauthorize") {
    return response.status(401).json({ error: error.message });
  } else if (error.name === "NotFound") {
    return response.status(404).json({ error: error.message });
  } else {
    return response.status(500).json({
      error: error.message || "unknown error",
    });
  }
};

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
    } catch {
      return res.status(401).json({ error: "token invalid" });
    }
  } else {
    return res.status(401).json({ error: "token missing" });
  }
  next();
};

const validateLoginState =  async (req, res, next) => {
  const session = await Session.findOne({where: {userId: req.decodedToken.id}})
  if (!session) {
    const error = new Error('Please log in')
    error.name = 'Unauthorize'
    next(error)
  }
  next();
}

module.exports = {
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  validateLoginState
};

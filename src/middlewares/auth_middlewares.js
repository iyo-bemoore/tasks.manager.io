const messages = require("../config/errors");

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(503).send({ error: messages["invalid_request"] });
};

module.exports = errorHandler;

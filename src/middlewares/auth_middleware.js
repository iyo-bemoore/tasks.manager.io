const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(503).send("Something broke!");
};

module.exports = errorHandler;

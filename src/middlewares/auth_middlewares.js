const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const messages = require("../config/errors");

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(503).send({ error: messages["invalid_request"] });
};

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).send("<div>You must be logged in!</div>");
  }
  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, process.env.JWT_SECRET, async (error, payload) => {
    if (error) {
      return res.status(401).send({ error: "You must be logged in !" });
    }
    const { useId } = payload;
    const user = await User.findById(useId);
    req.user = user;
    req.token = token;
    next();
  });
};

module.exports = { errorHandler: errorHandler, auth: auth };

const express = require("express");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const router = express.Router();

router.post("/users", (req, res) => {
  console.log(req.body);
  res.send("Test succesfull");
});

module.exports = router;

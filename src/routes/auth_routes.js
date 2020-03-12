const express = require("express");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const router = express.Router();
const messages = require("../config/errors");
router.use(express.json());

router.post("/users", async (req, res) => {
  const { name, email, password } = req.body;

  if ((!name, !email, !password)) {
    return res.status(503).send({ error: messages["incomplete"] });
  }
  try {
    const user = new User({
      name,
      email,
      password
    });
    await user.save();
    res.status(201).send(user);
  } catch (e) {
    if (e.message.includes("duplicate")) {
      return res.status(503).send({ error: messages["not_registered"] });
    }
    res.status(503).send({ error: e.message });
  }
});

module.exports = router;

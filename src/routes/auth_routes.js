const express = require("express");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const router = express.Router();

router.use(express.json());

router.post("/users", async (req, res) => {
  const { name, email, password } = req.body;

  if ((!name, !email, !password)) {
    return res.status(503).send({ error: "You must provide all the inputs" });
  }
  try {
    const user = new User({
      name,
      email,
      password
    });
    await user.save();
    res.send(user);
  } catch (e) {
    if (e.message.includes("duplicate")) {
      return res.status(503).send({ error: "Unable to register user!" });
    }
    res.status(503).send({ error: e.message });
  }
});

module.exports = router;

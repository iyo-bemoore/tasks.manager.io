const express = require("express");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const router = express.Router();
const messages = require("../config/errors");
const validateBodyParams = require("../config/helpers");
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
router.get("/users", async (req, res) => {
  try {
    let users = await User.find({});

    res.status(200).send(users);
  } catch (e) {
    return res.status(502).send({ error: e.message });
  }
});
router.get("/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    let user = await User.findById(id);
    res.status(200).send(user);
  } catch (error) {
    return res.status(502).render("404");
  }
});
router.patch("/users/:id", async (req, res) => {
  const { id } = req.params;

  if (!validateBodyParams(User.schema, req.body)) {
    return res.status(502).send({ error: messages["cannont_update"] });
  }

  try {
    let user = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });
    if (!user) {
      return res.status(404).send({ error: messages["cannont_update"] });
    }
    res.status(200).send(user);
  } catch (e) {
    res.status(503).send({ error: messages["cannont_update"] });
  }
});

router.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    let user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).send({ error: messages["cannont_update"] });
    }
    res.status(201).send({ succes: messages["user_removed"] });
  } catch (error) {
    res.status(503).send({ error: messages["cannont_update"] });
  }
});

module.exports = router;

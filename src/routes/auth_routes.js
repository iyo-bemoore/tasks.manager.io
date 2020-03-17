const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const router = express.Router();
require("../db/models/User");

const messages = require("../config/errors");
const validateBodyParams = require("../config/helpers");

router.use(express.json());
const { auth } = require("../middlewares/auth_middlewares");

const upload = multer({
  dest: "avatars"
});

// signup
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
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    if (e.message.includes("duplicate")) {
      return res.status(503).send({ error: messages["not_registered"] });
    }
    res.status(503).send({ error: e.message });
  }
});

//signin

router.post("/users/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).send({ error: messages["not_registered"] });
  }

  let user = await User.findOne({ email });

  if (!user) {
    return res.status(401).send({ error: messages["not_registered"] });
  }

  try {
    await user.comparePassword(password);
    const token = await user.generateAuthToken();
    res.status(200).send({ user, token });
  } catch (e) {
    res.status(501).send({ error: e.message });
  }
});

// logout

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      token => token.token !== req.token
    );
    await req.user.save();
    res.status(200).send();
  } catch (e) {
    res.status(402).send({ error: e.message });
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.status(200).send();
  } catch (e) {
    res.status(402).send({ error: e.message });
  }
});

router.get("/users/me", auth, async (req, res) => {
  const { user } = req;
  if (!user) {
    return res.status(402).send({ error: messages["user_not_found"] });
  }
  res.status(200).send(user);
});

router.get("/users/me", async (req, res) => {
  const { id } = req.user._id;

  try {
    let user = await User.findById(id);
    res.status(200).send(user);
  } catch (error) {
    return res.status(502).render("404");
  }
});

router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);

  if (!validateBodyParams(User.schema, req.body)) {
    return res.status(502).send({ error: messages["cannont_update"] });
  }

  try {
    updates.forEach(update => (req.user[update] = req.body[update]));
    await req.user.save();

    res.status(200).send(req.user);
  } catch (e) {
    res.status(503).send({ error: messages["cannont_update"] });
  }
});

router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    res.status(201).send({ succes: messages["user_removed"] });
  } catch (error) {
    res.status(503).send({ error: messages["cannont_update"] });
  }
});

router.post("/users/me/avatar", upload.single("avatar"), (req, res) => {
  res.send();
});

module.exports = router;

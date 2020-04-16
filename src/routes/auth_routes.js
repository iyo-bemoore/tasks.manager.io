const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const router = express.Router();
require("../db/models/User");
const validateBodyParams = require("../config/helpers");
const { auth } = require("../middlewares/auth_middlewares");
const messages = require("../config/errors");

const {
  sendWelcomeMessage,
  sendSubscriptionCancelationMessage
} = require("../emails/account");

router.use(express.json());

const upload = multer({
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, cb) {
    const acceptedExtensions = ["jpg", "jpeg", "png"];
    const fileExtension = file.mimetype.split("/")[1];
    if (!acceptedExtensions.includes(fileExtension.toLocaleLowerCase())) {
      return cb(new Error("Only images are supported"), false);
    }
    cb(undefined, true);
  }
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
    sendWelcomeMessage(email, name);
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
    return res.status(404).send({ error: messages["user_not_found"] });
  }
  res.status(200).send(user);
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
    sendSubscriptionCancelationMessage(req.user.email, req.user.name);
    res.status(201).send({ succes: messages["user_removed"] });
  } catch (error) {
    res.status(503).send({ error: messages["cannont_update"] });
  }
});

router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    req.user.avatar = buffer;

    await req.user.save();
    res.send();
  },
  (err, req, res, next) => {
    res.status(400).send({ error: err.message });
  }
);

router.delete("/users/me/avatar", auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.status(200).send();
});

router.get("/users/:id/avatar", async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    if (!user || !user.avatar) {
      throw new Error("No User or no image defined");
    }
    res.set("Content-type", "image/png");
    res.send(user.avatar);  
  } catch (error) {
    res.status(404).send;
  }
});

module.exports = router;

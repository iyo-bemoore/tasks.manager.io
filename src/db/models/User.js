const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("You must provide a valid email address");
        }
      }
    },
    password: {
      required: true,
      type: String,
      minlength: 6,
      trim: true,
      validate(value) {
        if (value.toLowerCase().includes("password")) {
          throw new Error("Password must not include the word password!");
        }
      }
    },
    avatar: {
      type: Buffer
    },
    tokens: [
      {
        token: {
          type: String,
          required: true
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

UserSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "owner"
});

UserSchema.pre("save", function(next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.toJSON = function() {
  const user = this;
  const userObject = user.toObject();
  const { password, tokens, avatar, ...newUserObject } = userObject;
  return newUserObject;
};
UserSchema.methods.comparePassword = async function(candidatePassword) {
  const user = this;
  const isMatch = await bcrypt.compare(candidatePassword, user.password);
  if (!isMatch) {
    throw new Error("Unable to log in");
  }
  return user;
};
UserSchema.methods.generateAuthToken = async function() {
  const user = this;
  const token = jwt.sign({ useId: user._id }, process.env.JWT_SECRET);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};
mongoose.model("User", UserSchema).init();

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  password: {
    required: true,
    type: String,
    minlength: 6,
    trim: true,
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error(
          "Password must not include the word password you dufus!"
        );
      }
    }
  }
});

mongoose.model("User", UserSchema);

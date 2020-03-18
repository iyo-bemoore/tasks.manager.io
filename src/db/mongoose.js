const mongoose = require("mongoose");
const express = require("express");
require("dotenv").config();

const mongoClientURI = `${process.env.MONGO_DB_HD}${process.env.MONGO_DB_USR}:${
  process.env.MONGO_DB_PSWD
}${
  process.env.NODE_ENV === "development"
    ? process.env.MONGO_DB_BASE
    : process.env.MONGO_DB_BASE_PRD
}`;
mongoose.connect(mongoClientURI, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});
mongoose.connection.on("error", error => {
  console.log("custom ", error.message);
});
mongoose.connection.on("connected", () => {
  console.log("connected to mongodb");
});

const mongoose = require("mongoose");
const express = require("express");
require("dotenv").config();

const mongoClientURI = `${process.env.MONGO_DB_HD}${process.env.MONGO_DB_USR}:${process.env.MONGO_DB_PSWD}${process.env.MONGO_DB_BASE}`;
mongoose.connect(mongoClientURI, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.connection.on("error", error => {
  console.log("custom ", error.message);
});
mongoose.connection.on("connected", () => {
  console.log("connected to mongodb");
});

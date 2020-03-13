const express = require("express");
const mongoose = require("mongoose");
const Task = mongoose.model("Task");
const router = express.Router();
const messages = require("../config/errors");

router.use(express.json());

router.post("/task", async (req, res) => {
  const { description, completed } = req.body;

  if (!description) {
    return res.status(502).send({ error: messages["task_not_specified"] });
  }

  try {
    let task = new Task({
      description,
      completed
    });
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(502).send({ error: e.message });
  }
});

router.get("/tasks", async (req, res) => {
  try {
    let tasks = await Task.find({});

    res.status(201).send(tasks);
  } catch (e) {
    res.status(404).send({ error: e.message });
  }
});
module.exports = router;

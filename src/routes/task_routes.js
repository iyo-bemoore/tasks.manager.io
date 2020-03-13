const express = require("express");
const mongoose = require("mongoose");
const Task = mongoose.model("Task");
const router = express.Router();
const messages = require("../config/errors");
const validateBodyParams = require("../config/helpers");

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

router.patch("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  if (!validateBodyParams(Task.schema, req.body)) {
    return res.status(502).send({ error: messages["cannont_update_task"] });
  }

  try {
    let task = await Task.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });
    if (!task) {
      return res.status(400).send({ error: messages["cannont_update_task"] });
    }
    res.status(200).send(task);
  } catch (e) {
    res.status(503).send({ error: messages["cannont_update_task"] });
  }
});

router.delete("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  try {
    let task = await Task.findByIdAndDelete(id);
    if (!task) {
      return res.status(404).send({ error: messages["cannont_update_task"] });
    }
    res.status(201).send({ succes: messages["task_removed"] });
  } catch (error) {
    res.status(503).send({ error: messages["cannont_update_task"] });
  }
});

module.exports = router;

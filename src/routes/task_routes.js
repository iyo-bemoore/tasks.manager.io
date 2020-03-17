const { auth } = require("../middlewares/auth_middlewares");
const express = require("express");
const mongoose = require("mongoose");
const Task = mongoose.model("Task");
const router = express.Router();
const messages = require("../config/errors");
const validateBodyParams = require("../config/helpers");

router.use(express.json());

router.post("/task", auth, async (req, res) => {
  const { description, completed } = req.body;

  if (!description) {
    return res.status(502).send({ error: messages["task_not_specified"] });
  }

  try {
    let task = new Task({
      description,
      completed,
      owner: req.user._id
    });
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(502).send({ error: e.message });
  }
});

router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;

  try {
    let task = await Task.findOne({ _id, owner: req.user._id });
    if (!task) {
      return res.status(404).send({ error: "Not found" });
    }
    res.status(201).send(task);
  } catch (e) {
    res.status(404).send({ error: e.message });
  }
});

router.get("/tasks", auth, async (req, res) => {
  const match = {};
  const sort = {};
  if (req.query.completed) {
    match.completed = req.query.completed === "true";
  }
  if (req.query.sortBy) {
    const queryStringParts = req.query.sortBy.split("_");
    sort[queryStringParts[0]] = queryStringParts[1] == "desc" ? -1 : 1;
  }

  try {
    await req.user
      .populate({
        path: "tasks",
        match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort
        }
      })
      .execPopulate();

    res.status(201).send(req.user.tasks);
  } catch (e) {
    res.status(404).send({ error: e.message });
  }
});

router.patch("/tasks/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);

  if (!validateBodyParams(Task.schema, req.body)) {
    return res.status(502).send({ error: messages["cannont_update_task"] });
  }

  try {
    let task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
    if (!task) {
      return res.status(400).send({ error: messages["cannont_update_task"] });
    }
    updates.forEach(update => (task[update] = req.body[update]));
    await task.save();
    res.status(200).send(task);
  } catch (e) {
    res.status(503).send({ error: messages["cannont_update_task"] });
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    let task = await Task.findOneAndDelete({ _id, owner: req.user._id });
    if (!task) {
      return res.status(404).send({ error: messages["cannont_update_task"] });
    }
    res.status(201).send({ succes: messages["task_removed"] });
  } catch (error) {
    res.status(503).send({ error: messages["cannont_update_task"] });
  }
});

module.exports = router;

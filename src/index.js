require("./db/models/User");
require("./db/models/Task");
require("./db/mongoose");
const { auth } = require("./middlewares/auth_middlewares");
const path = require("path");
const { errorHandler } = require("./middlewares/auth_middlewares");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;
const autRoutes = require("./routes/auth_routes");
const taskRoutes = require("./routes/task_routes");
const publicDirectoryPath = path.join(__dirname, "./public");
require("dotenv").config();

app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

app.use(express.static(publicDirectoryPath));
app.use(autRoutes);
app.use(taskRoutes);
app.use(express.json());
app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("Connected");
});

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});

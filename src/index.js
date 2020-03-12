require("./db/models/User");
require("./db/models/Task");
require("./db/mongoose");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const autRoutes = require("./routes/auth_routes");
require("dotenv").config();

app.use(autRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.get("/", (req, res) => {
  res.send("Connected");
});

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});

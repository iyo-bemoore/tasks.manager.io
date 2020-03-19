const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../src/app");
const mongoose = require("mongoose");
const User = mongoose.model("User");
require("../src/db/models/User");

process.env.NODE_ENV = "test";

const _id = new mongoose.Types.ObjectId();

const dummyUser = {
  _id,
  name: "dummy",
  email: "dummy@dummy.com",
  password: "pooiiiuytdnkvd",
  tokens: [{ token: jwt.sign({ _id }, process.env.JWT_SECRET) }]
};

beforeEach(async () => {
  await User.deleteMany();
  await new User(dummyUser).save();
});

test("Should signup a new user", async () => {
  await request(app)
    .post("/users")
    .send({
      name: "bard",
      email: "imadyouswufi@google.com",
      password: "MyPaffoiue"
    })
    .expect(201);
});

test("Should signin an existing user", async () => {
  const response = await request(app)
    .post("/users/login")
    .send({ ...dummyUser })
    .expect(200);

  let user = await User.findById(response.body.user._id);
  expect(response.body.token).toBe(user.tokens[1].token);
});

test("SHould not authenticated an unregistered user", async () => {
  await request(app)
    .post("/users/login")
    .send({ email: "al@goi.com", password: "123456789" })
    .expect(401);
});

test("Should return logged in user", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${dummyUser.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should not return an unauthenticated user", async () => {
  await request(app)
    .get("/users/me")
    .send()
    .expect(401);
});

test("Should delete user account", async () => {
  let response = await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${dummyUser.tokens[0].token}`)
    .send()
    .expect(201);
  let user = await User.findById(response.body.user);
  expect(user).toBeNull();
});

test("Should not delete unauthenticated user", async () => {
  await request(app)
    .delete("/users/me")
    .send()
    .expect(401);
});

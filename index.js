import express from "express";
import mongoose from "mongoose";
import checkAuth from "./utils/checkAuth.js";
import { register, login, getMe } from "./controllers/UserController.js";
import {
  loginValidation,
  postCreateValidation,
  registerValidation,
} from "./validations.js";
import {
  create,
  getAll,
  getOne,
  remove,
  update,
} from "./controllers/PostController.js";

mongoose
  .connect(
    "mongodb+srv://admin:qqqqqq@cluster0.nmgy5fc.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB Ok"))
  .catch((err) => console.log("Db Err", err));

const app = express();

app.use(express.json());

app.post("/auth/login", loginValidation, login);
app.post("/auth/register", registerValidation, register);
app.get("/auth/me", checkAuth, getMe);

app.get("/posts", getAll);
app.get("/posts/:id", getOne);
app.delete("/posts/:id", checkAuth, remove);
app.post("/posts", checkAuth, postCreateValidation, create);
app.patch("/posts/:id", checkAuth, update);

app.listen(7777, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("Server OK");
});

import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";

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
  getLastTags,
  getOne,
  getSort,
  remove,
  update,
} from "./controllers/PostController.js";
import handlesValidationErrors from "./utils/handlesValidationErrors.js";

mongoose
  .connect(
    "mongodb+srv://admin:qqqqqq@cluster0.nmgy5fc.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB Ok"))
  .catch((err) => console.log("Db Err", err));

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use("/upload", express.static("uploads"));

app.post("/auth/login", loginValidation, handlesValidationErrors, login);
app.post(
  "/auth/register",
  registerValidation,
  handlesValidationErrors,
  register
);
app.get("/auth/me", checkAuth, getMe);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/upload/${req.file.originalname}`,
  });
});

app.get("/tags", getLastTags);

app.get("/posts", getAll);
app.get("/posts/sort", getSort);
app.get("/posts/tags", getLastTags);
app.get("/posts/:id", getOne);
app.delete("/posts/:id", checkAuth, remove);
app.post(
  "/posts",
  checkAuth,
  postCreateValidation,
  handlesValidationErrors,
  create
);
app.patch(
  "/posts/:id",
  checkAuth,
  postCreateValidation,
  handlesValidationErrors,
  update
);

app.listen(7777, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("Server OK");
});

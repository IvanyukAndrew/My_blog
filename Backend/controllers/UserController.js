import UserModel from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const register = async (req, res) => {
  try {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._doc._id,
      },
      "secrete123",
      {
        expiresIn: "30d",
      }
    );

    res.json({ ...user._doc, token });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не вдалося зарегістріруватися",
    });
  }
};

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        message: "Користувача не знайдено",
      });
    }

    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );

    if (!isValidPass) {
      return res.status(404).json({
        message: "Неправильний логін або пароль",
      });
    }

    const token = jwt.sign(
      {
        _id: user._doc._id,
      },
      "secrete123",
      {
        expiresIn: "30d",
      }
    );

    res.json({ ...user._doc, token });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не вдалося війти",
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "Користувача не знайдено",
      });
    }

    res.json({ ...user._doc });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Немає доступа",
    });
  }
};

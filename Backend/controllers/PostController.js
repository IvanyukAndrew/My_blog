import PostModel from "../models/Post.js";

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find()
      .populate("user")
      .sort({ createdAt: -1 })
      .exec();

    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не вдалося получити пости",
    });
  }
};

export const getSort = async (req, res) => {
  try {
    const posts = await PostModel.find()
      .populate("user")
      .sort({ viewCount: -1 })
      .exec();

    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не вдалося получити відсортовані пости",
    });
  }
};

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();

    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5);

    res.json(tags);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не вдалося получити пости",
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewCount: 1 },
      },
      {
        returnDocument: "after",
      }
    )
      .populate("user")
      .then((doc) => res.json(doc))
      .catch((err) =>
        res.status(500).json({
          message: "Не вдалося вернути пост",
        })
      );
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не вдалося получити пост",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.findOneAndDelete({
      _id: postId,
    })
      .then((doc) => {
        if (!doc) {
          return res.status(500).json({
            message: "Виникла помилка при видалені",
          });
        }

        res.json({
          success: true,
        });
      })
      .catch((err) =>
        res.status(500).json({
          message: "Не вдалося видалити пост",
        })
      );
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не вдалося получити пост",
    });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      tags: req.body.tags.split(","),
      imageUrl: req.body.imageUrl,
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не вдалося создати пост",
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        tags: req.body.tags.split(","),
        imageUrl: req.body.imageUrl,
        user: req.userId,
      }
    );

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не вдалося обновити пост",
    });
  }
};

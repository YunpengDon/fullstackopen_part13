const jwt = require("jsonwebtoken");
const router = require("express").Router();
const { Op } = require("sequelize");
const { Blog, User } = require("../models");
const { SECRET } = require("../util/config");

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
    } catch {
      return res.status(401).json({ error: "token invalid" });
    }
  } else {
    return res.status(401).json({ error: "token missing" });
  }
  next();
};

router.get("/", tokenExtractor, async (req, res) => {
  const blogs = await Blog.findAll({
    include: {
      model: User,
      attributes: ["name"],
    },
    where: {
      [Op.or]: {
        title: {
          [Op.substring]: req.query.search ? req.query.search : "",
        },
        author: {
          [Op.substring]: req.query.search ? req.query.search : "",
        },
      },
    },
    order: [["likes", "DESC"]],
  });
  res.json(blogs);
});

router.post("/", tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id);
  const blog = await Blog.create({ ...req.body, userId: user.id });
  res.json(blog);
});

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  if (!req.blog) {
    const error = new Error("Blog not found");
    error.name = "NotFound";
    return next(error);
  }
  next();
};

router.get("/:id", blogFinder, async (req, res) => {
  if (req.blog) {
    res.json(req.blog);
  } else {
    res.status(404).end();
  }
});

router.put("/:id", blogFinder, async (req, res) => {
  const likes = req.body?.likes;
  if (req.blog && likes) {
    await req.blog.update({ likes: likes });
    res.json(req.blog);
  } else {
    res.status(404).end();
  }
});

router.delete("/:id", tokenExtractor, blogFinder, async (req, res, next) => {
  if (req.decodedToken.id !== req.blog.userId) {
    const error = new Error(
      "Only the user who added the blog can delete the blog"
    );
    return next(error);
  }
  if (req.blog) {
    await req.blog.destroy();
    res.json(req.blog);
  } else {
    res.status(404).end();
  }
});

module.exports = router;

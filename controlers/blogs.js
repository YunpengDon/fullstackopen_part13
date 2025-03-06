const router = require("express").Router();
const { Op } = require("sequelize");
const { Blog, User } = require("../models");
const { tokenExtractor, validateLoginState } = require("../util/middleware");

router.get("/", tokenExtractor, validateLoginState, async (req, res) => {
  const blogs = await Blog.findAll({
    include: {
      model: User,
      attributes: ["name"], 
    },
    where: {
      [Op.or]: {
        title: {
          [Op.iLike]: req.query.search ? `%${req.query.search}%` : "%%",
        },
        author: {
          [Op.iLike]: req.query.search ? `%${req.query.search}%` : "%%",
        },
      },
    },
    order: [["likes", "DESC"]],
  });
  res.json(blogs);
});

router.post("/", tokenExtractor, validateLoginState, async (req, res) => {
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

router.get("/:id", tokenExtractor, validateLoginState, blogFinder, async (req, res) => {
  if (req.blog) {
    res.json(req.blog);
  } else {
    res.status(404).end();
  }
});

router.put("/:id", tokenExtractor, validateLoginState, blogFinder, async (req, res) => {
  const likes = req.body?.likes;
  if (req.blog && likes) {
    await req.blog.update({ likes: likes });
    res.json(req.blog);
  } else {
    res.status(404).end();
  }
});

router.delete("/:id", tokenExtractor, validateLoginState, blogFinder, async (req, res, next) => {
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

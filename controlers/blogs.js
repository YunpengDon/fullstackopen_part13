const router = require("express").Router();
const { Blog } = require("../models");

router.get("/", async (req, res) => {
  const blogs = await Blog.findAll();
  res.json(blogs);
});

router.post("/", async (req, res) => {
  const blog = await Blog.create(req.body);
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

router.delete("/:id", blogFinder, async (req, res) => {
  if (req.blog) {
    await req.blog.destroy();
    res.json(req.blog);
  } else {
    res.status(404).end();
  }
});

module.exports = router;

const router = require("express").Router();
const { Blog } = require("../models");

router.get("/", async (req, res) => {
  const blogs = await Blog.findAll();
  res.json(blogs);
});

router.post("/", async (req, res) => {
  try {
    console.log(req.body);
    const blog = await Blog.create(req.body);
    res.json(blog);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.get("/:id", async (req, res) => {
  const blog = await Blog.findByPk(req.params.id);
  if (blog) {
    res.json(blog);
  } else {
    res.status(404).end();
  }
});

router.put("/:id", async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    const likes = req.body?.likes;
    if (blog && likes) {
      await blog.update({ likes: likes });
      res.json(blog);
    }
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    if (blog) {
      await blog.destroy();
      res.json(blog);
    }
  } catch (error) {
    return res.status(400).json({ error });
  }
});

module.exports = router;

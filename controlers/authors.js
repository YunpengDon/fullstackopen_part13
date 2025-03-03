const router = require("express").Router();
const { Blog } = require("../models");

router.get("/", async (req, res) => {
  const authors = await Blog.findAll({
    group: 'author'
  });
  res.json(authors);
});

module.exports = router;
const router = require("express").Router();
const { User, Blog, ReadingList } = require("../models");

router.get("/", async (req, res) => {
  const list = await ReadingList.findAll({
    attributes: ["blogId", "userId"],
  });
  res.json(list);
});

router.post("/", async (req, res) => {
  if (req.body) {
    const user = await User.create({
      ...req.body,
    });
    res.json(user);
  }
});

module.exports = router;

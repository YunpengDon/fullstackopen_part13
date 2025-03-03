const router = require("express").Router();
const { User, Blog } = require("../models");

router.get("/", async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: ['author','title', 'url']
    }
  });
  res.json(users);
});

router.post("/", async (req, res) => {
  if (req.body) {
    const user = await User.create({
      ...req.body,
    });
    res.json(user);
  }
});

router.put("/:username", async (req, res, next) => {
  const user = await User.findOne({ where: { username: req.params.username } });
  if (user) {
    await user.update({
      ...req.body,
    });
    res.json(req.body);
  } else {
    const error = new Error("User not found");
    error.name = "NotFound";
    return next(error);
  }
});

module.exports = router;

const router = require("express").Router();
const { User, Blog } = require("../models");
const { Op } = require("sequelize");

router.get("/", async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: ["author", "title", "url"],
    },
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

router.get("/:id", async (req, res, next) => {
  const where = req.query.read
    ? { read: { [Op.is]: JSON.parse(req.query.read.toLowerCase()) } }
    : {};
  const user = await User.findOne({
    where: { id: req.params.id },
    attributes: ["name", "username"],
    include: [
      {
        model: Blog,
        as: "readings",
        attributes: ["id", "url", "title", "author", "likes", "year"],
        through: {
          as: "readinglists",
          attributes: ["read", "id"],
          where,
        },
      },
    ],
  });
  if (user) {
    res.json(user);
  } else {
    const error = new Error("User not found");
    error.name = "NotFound";
    return next(error);
  }
});

module.exports = router;

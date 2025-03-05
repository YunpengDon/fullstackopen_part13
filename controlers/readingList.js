const router = require("express").Router();
const { User, Blog, ReadingList } = require("../models");
const { tokenExtractor } = require("../util/middleware");

router.get("/", async (req, res) => {
  const list = await ReadingList.findAll({
    attributes: ["blogId", "userId"],
  });
  res.json(list);
});

router.post("/", async (req, res) => {
  if (req.body) {
    const list = await ReadingList.create({
      ...req.body,
    });
    res.json(list);
  }
});

router.put("/:id", tokenExtractor, async (req, res, next) => {
  const userId = req.decodedToken.id;
  const list = await ReadingList.findByPk(req.params.id);
  if (userId !== list.userId) {
    const error = new Error(
      "Only the user who own the list can mark it as read"
    );
    error.name = "ValidationError";
    return next(error);
  }
  if (req.body.read !== undefined) {
    const result = await list.update({
      read: req.body.read,
    });
    return res.json(result);
  }
  throw new SyntaxError("Attribute 'read' is required");
});

module.exports = router;

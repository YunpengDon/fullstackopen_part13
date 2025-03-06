const router = require("express").Router();
const { Session } = require("../models");
const sequelize = require("sequelize");

const { tokenExtractor, validateLoginState } = require("../util/middleware");

router.delete("/", tokenExtractor, validateLoginState, async (req, res) => {
  const session = await Session.findOne({
    where: { userId: req.decodedToken.id },
  });
  await session.destroy();
  res.send("log out");
});

module.exports = router;

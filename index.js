const express = require("express");
const app = express();
const blogRouter = require("./controlers/blogs");
const { PORT } = require("./util/config");

app.use(express.json());
app.use("/api/blogs", blogRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

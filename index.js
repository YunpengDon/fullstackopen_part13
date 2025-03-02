const express = require("express");
require("express-async-errors");
const app = express();
const blogRouter = require("./controlers/blogs");
const userRouter = require("./controlers/users");
const middleware = require("./util/middleware");
const { PORT } = require("./util/config");

app.use(express.json());
app.use("/api/blogs", blogRouter);
app.use("/api/users", userRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

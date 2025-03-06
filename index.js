const express = require("express");
require("express-async-errors");
const app = express();
const blogRouter = require("./controlers/blogs");
const authorRouter = require("./controlers/authors");
const userRouter = require("./controlers/users");
const loginRouter = require("./controlers/login");
const logoutRouter = require("./controlers/logout");
const readingListRouter = require("./controlers/readingList");
const middleware = require("./util/middleware");
const { PORT } = require("./util/config");
const { connectToDatabase } = require("./util/db");

app.use(express.json());
app.use("/api/blogs", blogRouter);
app.use("/api/authors", authorRouter);
app.use("/api/users", userRouter);
app.use("/api/readinglists", readingListRouter);
app.use("/api/login", loginRouter);
app.use("/api/logout", logoutRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();

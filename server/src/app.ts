import { authenticateToken } from "./middlewares/auth_middleware";

const dotenv = require("dotenv");
const morgan = require("morgan");
const express = require("express");
const crossOrigin = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

dotenv.config();

const appPromise: Promise<any> = new Promise((resolve, reject) => {
  mongoose
    .connect(process.env.DB_CONNECT)
    .then(() => {
      console.log("Connected to database successfully");
      const app = express();

      app.use(crossOrigin({ origin: "*" }));
      app.use(morgan("dev"));
      app.use(express.static("public"));
      
      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({ extended: true }));

      app.use(authenticateToken);

      const authRouter = require("./routes/auth_route");
      app.use("/auth", authRouter);

      const postsRouter = require("./routes/posts_route");
      app.use("/posts", postsRouter);

      const commentsRouter = require("./routes/comments_route");
      app.use("/comments", commentsRouter);

      const usersRouter = require("./routes/users_route");
      app.use("/users", usersRouter);

      app.use((error, req, res) => {
        console.error(error.stack);
        res.status(500).send("Something broke!");
      });

      resolve(app);
    })
    .catch((error) => console.error(error));
});

export default appPromise;

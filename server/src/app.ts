import { authenticateToken } from "./middlewares/auth_middleware";
import { swaggerOptions } from "./swagger/swagger_setup";

const dotenv = require("dotenv");
const morgan = require("morgan");
const express = require("express");
const crossOrigin = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const path = require("path");
const history = require("connect-history-api-fallback");

dotenv.config();
const specs = swaggerJsdoc(swaggerOptions);

const appPromise: Promise<any> = new Promise((resolve, reject) => {
  mongoose
    .connect(process.env.DB_CONNECT)
    .then(() => {
      console.log("Connected to database successfully");
      const app = express();

      app.use(crossOrigin({ origin: "*" }));
      app.use(morgan("dev"));

      app.use(
        "/api-docs",
        swaggerUi.serve,
        swaggerUi.setup(specs, { explorer: true })
      );

      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({ extended: true }));

      app.use(authenticateToken);

      const AIRouter = require("./routes/AI_route");
      app.use("/api/AI", AIRouter);

      const authRouter = require("./routes/auth_route");
      app.use("/api/auth", authRouter);

      const postsRouter = require("./routes/posts_route");
      app.use("/api/posts", postsRouter);

      const commentsRouter = require("./routes/comments_route");
      app.use("/api/comments", commentsRouter);

      const usersRouter = require("./routes/users_route");
      app.use("/api/users", usersRouter);

      app.use(
        "/api/images",
        express.static("public/images", {
          maxAge: 0,
          etag: false,
        })
      );
      app.use(history());

      app.use(
        express.static("front", {
          maxAge: 0,
          etag: false,
        })
      );

      // Error handling for static files
      app.use((req, res, next) => {
        res.status(404).send("File not found");
      });

      app.use((error, req, res) => {
        console.error(error.stack);
        res.status(200).send({
          error: error.message,
        });
      });

      resolve(app);
    })
    .catch((error) => console.error(error));
});

export default appPromise;

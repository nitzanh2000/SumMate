import jwt from "jsonwebtoken";
import { NextFunction, Response } from "express";

// TODO: check if path '/' is good
const ALLOWED_PATHS = ["api/auth", "/"];
const AUTH_PATH = "/api";
export const authenticateToken = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  if (
    ALLOWED_PATHS.some((path) => req.path.includes(path)) ||
    !req.path.includes(AUTH_PATH)
  ) {
    return next();
  } else {
    const authBearer = req.headers["authorization"];
    const accessToken = authBearer && authBearer.split(" ")[1];

    if (!accessToken) {
      return res.status(401).send("No token provided");
    }

    jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, user) => {
        if (err) {
          res.status(403).send("Unauthorized");
        } else {
          req.user = user;
          next();
        }
      }
    );
  }
};

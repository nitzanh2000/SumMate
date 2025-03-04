import * as express from "express";
import { getMe } from "../controllers/users_controller";

const router = express.Router();

router.get("/me", getMe);

module.exports = router;

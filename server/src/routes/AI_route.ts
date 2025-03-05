import * as express from "express";
import { improveText } from "../controllers/AI_controller";

const router = express.Router();

router.post("/api/improve-text", async (req, res) => {
  try {
    const improvedText = await improveText(req.body.text);

    res.json({ improvedText });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;

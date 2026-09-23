import { Router } from "express";
import { STATIC } from "../db.js";

const router = Router();

router.get("/departments", (req, res) => res.json(STATIC.DEPARTMENTS));
router.get("/districts", (req, res) => res.json(STATIC.DISTRICTS));
router.get("/tags", (req, res) => res.json(
  STATIC.TAGS.map((tag) => ({ tag, label: STATIC.TAG_LABELS[tag] || tag }))
));

export default router;

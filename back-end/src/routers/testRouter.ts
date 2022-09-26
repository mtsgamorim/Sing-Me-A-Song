import { Router } from "express";
import { resetDatabase } from "../controllers/testsController.js";

const router = Router();

router.post("/tests/reset", resetDatabase);

export default router;

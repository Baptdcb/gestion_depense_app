import { Router } from "express";
import * as reportController from "../controllers/report.controller";

const router = Router();

router.get("/history", reportController.getHistory);

export default router;

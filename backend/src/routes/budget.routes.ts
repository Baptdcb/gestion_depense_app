import { Router } from "express";
import * as budgetController from "../controllers/budget.controller";

const router = Router();

router.get("/", budgetController.getBudget);
router.post("/", budgetController.setBudget);

export default router;

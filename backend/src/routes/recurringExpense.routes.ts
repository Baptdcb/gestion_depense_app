import { Router } from "express";
import * as recurringController from "../controllers/recurringExpense.controller";

const router = Router();

router.get("/", recurringController.listRecurringExpenses);
router.post("/", recurringController.createRecurringExpense);
router.put("/:id", recurringController.updateRecurringExpense);
router.delete("/:id", recurringController.deleteRecurringExpense);

export default router;

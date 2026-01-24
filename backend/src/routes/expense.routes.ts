import { Router } from 'express';
import * as expenseController from '../controllers/expense.controller';

const router = Router();

router.get('/', expenseController.listExpenses);
router.post('/', expenseController.addExpense);
router.get('/summary', expenseController.getSummary);

export default router;

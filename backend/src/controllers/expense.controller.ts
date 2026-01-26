import { Request, Response, NextFunction } from "express";
import * as expenseService from "../services/expense.service";
import { z } from "zod";

const monthSchema = z
  .string()
  .regex(/^\d{4}-\d{2}$/, "Le format du mois doit être YYYY-MM");

const createExpenseSchema = z.object({
  montant: z.number().positive("Le montant doit être positif"),
  description: z.string().optional(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "La date doit être au format YYYY-MM-DD"), // Modified to accept simple date
  categorieId: z.number().int().positive(),
});

export const addExpense = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData = createExpenseSchema.parse(req.body);
    const expense = await expenseService.createExpense({
      ...validatedData,
      date: new Date(validatedData.date),
    });
    res.status(201).json(expense);
  } catch (error) {
    next(error);
  }
};

export const listExpenses = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { month } = req.query;
    const validatedMonth = monthSchema.parse(month);
    const expenses = await expenseService.getExpensesByMonth(validatedMonth);
    res.json(expenses);
  } catch (error) {
    next(error);
  }
};

export const getSummary = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { month } = req.query;
    const validatedMonth = monthSchema.parse(month);
    const summary = await expenseService.getMonthlySummary(validatedMonth);
    res.json(summary);
  } catch (error) {
    next(error);
  }
};

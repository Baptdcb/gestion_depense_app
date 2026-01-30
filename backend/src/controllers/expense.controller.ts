import { Request, Response, NextFunction } from "express";
import * as expenseService from "../services/expense.service";
import * as recurringService from "../services/recurringExpense.service";
import { z } from "zod";

const monthSchema = z
  .string()
  .regex(/^\d{4}-\d{2}$/, "Le format du mois doit être YYYY-MM");

const yearSchema = z
  .string()
  .regex(/^\d{4}$/, "Le format de l'année doit être YYYY");

const createExpenseSchema = z.object({
  montant: z.number().positive("Le montant doit être positif"),
  description: z.string().optional(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "La date doit être au format YYYY-MM-DD"), // Modified to accept simple date
  categorieId: z.number().int().positive(),
});

const updateExpenseSchema = z.object({
  montant: z.number().positive().optional(),
  description: z.string().nullable().optional(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "La date doit être au format YYYY-MM-DD")
    .optional(),
  categorieId: z.number().int().positive().optional(),
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
    const { month, year } = req.query;
    if (month) {
      const validatedMonth = monthSchema.parse(month);
      await recurringService.ensureRecurringExpensesForMonth(validatedMonth);
      const expenses = await expenseService.getExpensesByMonth(validatedMonth);
      res.json(expenses);
      return;
    }
    if (year) {
      const validatedYear = Number(yearSchema.parse(year));
      await recurringService.ensureRecurringExpensesForYear(validatedYear);
      const expenses = await expenseService.getExpensesByYear(validatedYear);
      res.json(expenses);
      return;
    }
    res.status(400).json({ message: "Paramètre month ou year requis." });
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
    const { month, year } = req.query;
    if (month) {
      const validatedMonth = monthSchema.parse(month);
      const summary = await expenseService.getMonthlySummary(validatedMonth);
      res.json(summary);
      return;
    }
    if (year) {
      const validatedYear = Number(yearSchema.parse(year));
      const summary = await expenseService.getYearlySummary(validatedYear);
      res.json(summary);
      return;
    }
    res.status(400).json({ message: "Paramètre month ou year requis." });
  } catch (error) {
    next(error);
  }
};

export const updateExpense = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = Number(req.params.id);
    const validatedData = updateExpenseSchema.parse(req.body);
    const expense = await expenseService.updateExpense(id, {
      ...validatedData,
      date: validatedData.date ? new Date(validatedData.date) : undefined,
    });
    res.json(expense);
  } catch (error) {
    next(error);
  }
};

export const deleteExpense = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = Number(req.params.id);
    const expense = await expenseService.deleteExpense(id);
    res.json(expense);
  } catch (error) {
    next(error);
  }
};

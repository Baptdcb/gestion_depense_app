import { Request, Response, NextFunction } from "express";
import * as budgetService from "../services/budget.service";
import { z } from "zod";

const monthSchema = z
  .string()
  .regex(/^\d{4}-\d{2}$/, "Le format du mois doit être YYYY-MM");

const setBudgetSchema = z.object({
  month: z
    .string()
    .regex(/^\d{4}-\d{2}$/, "Le format du mois doit être YYYY-MM"),
  globalLimit: z.number().nonnegative(),
  categoryBudgets: z.array(
    z.object({
      categoryId: z.number().int().positive(),
      limit: z.number().nonnegative(),
    }),
  ),
});

export const getBudget = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { month } = req.query;
    const validatedMonth = monthSchema.parse(month);

    // Return budget details, potentially with default flag
    const result = await budgetService.getBudgetOrDefault(validatedMonth);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const setBudget = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData = setBudgetSchema.parse(req.body);
    const result = await budgetService.setBudget(validatedData);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

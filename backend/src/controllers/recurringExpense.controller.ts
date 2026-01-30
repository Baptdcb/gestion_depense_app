import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import * as recurringService from "../services/recurringExpense.service";

const createRecurringSchema = z.object({
  montant: z.number().positive("Le montant doit être positif"),
  description: z.string().optional(),
  categorieId: z.number().int().positive(),
  active: z.boolean().optional(),
  startDate: z.string().optional(),
});

const updateRecurringSchema = z.object({
  montant: z.number().positive().optional(),
  description: z.string().nullable().optional(),
  categorieId: z.number().int().positive().optional(),
  active: z.boolean().optional(),
  startDate: z.string().optional(),
});

export const listRecurringExpenses = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const items = await recurringService.listRecurringExpenses();
    res.json(items);
  } catch (error) {
    next(error);
  }
};

export const createRecurringExpense = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validated = createRecurringSchema.parse(req.body);
    const created = await recurringService.createRecurringExpense({
      montant: validated.montant,
      description: validated.description,
      categorieId: validated.categorieId,
      active: validated.active,
      startDate: validated.startDate
        ? new Date(validated.startDate)
        : undefined,
    });
    res.status(201).json(created);
  } catch (error) {
    next(error);
  }
};

export const updateRecurringExpense = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = Number(req.params.id);
    const validated = updateRecurringSchema.parse(req.body);
    const updated = await recurringService.updateRecurringExpense(id, {
      ...validated,
      startDate: validated.startDate
        ? new Date(validated.startDate)
        : undefined,
    });
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

export const deleteRecurringExpense = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = Number(req.params.id);
    const deleted = await recurringService.deleteRecurringExpense(id);
    res.json(deleted);
  } catch (error) {
    next(error);
  }
};

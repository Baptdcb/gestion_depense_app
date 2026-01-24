import { Request, Response, NextFunction } from 'express';
import * as categoryService from '../services/category.service';
import { z } from 'zod';

const createCategorySchema = z.object({
  nom: z.string().min(1, "Le nom est requis"),
  icone: z.string().min(1, "L'icône est requise"),
});

export const listCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

export const addCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = createCategorySchema.parse(req.body);
    const newCategory = await categoryService.createCategory(validatedData);
    res.status(201).json(newCategory);
  } catch (error) {
    next(error);
  }
};

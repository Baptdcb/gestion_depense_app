import { Request, Response, NextFunction } from "express";
import * as categoryService from "../services/category.service";
import { z } from "zod";

const createCategorySchema = z.object({
  nom: z.string().min(1, "Le nom est requis"),
  icone: z.string().min(1, "L'icône est requise"),
  couleur: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Couleur invalide"),
});

const updateCategorySchema = createCategorySchema.partial();

export const listCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

export const addCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData = createCategorySchema.parse(req.body);
    const newCategory = await categoryService.createCategory(validatedData);
    res.status(201).json(newCategory);
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = parseInt(req.params.id);
    const validatedData = updateCategorySchema.parse(req.body);
    const updatedCategory = await categoryService.updateCategory(
      id,
      validatedData,
    );
    res.json(updatedCategory);
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = parseInt(req.params.id);
    await categoryService.deleteCategory(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

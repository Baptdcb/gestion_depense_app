import { Request, Response, NextFunction } from "express";
import * as reportService from "../services/report.service";

export const getHistory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const history = await reportService.getHistory();
    res.json(history);
  } catch (error) {
    next(error);
  }
};

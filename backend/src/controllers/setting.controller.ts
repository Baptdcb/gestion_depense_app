import { Request, Response, NextFunction } from "express";
import * as settingService from "../services/setting.service";

export const getSetting = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { key } = req.params;
    const setting = await settingService.getSetting(key);
    res.json(setting);
  } catch (error) {
    next(error);
  }
};

export const updateSetting = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { key } = req.params;
    const { value } = req.body;
    if (value === undefined) {
      return res.status(400).json({ message: "Value is required" });
    }
    const setting = await settingService.upsertSetting(key, String(value));
    res.json(setting);
  } catch (error) {
    next(error);
  }
};

import { Router } from "express";
import * as settingController from "../controllers/setting.controller";

const router = Router();

router.get("/:key", settingController.getSetting);
router.put("/:key", settingController.updateSetting);

export default router;

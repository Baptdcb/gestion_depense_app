"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setBudget = exports.getBudget = void 0;
const budgetService = __importStar(require("../services/budget.service"));
const zod_1 = require("zod");
const monthSchema = zod_1.z
    .string()
    .regex(/^\d{4}-\d{2}$/, "Le format du mois doit être YYYY-MM");
const setBudgetSchema = zod_1.z.object({
    month: zod_1.z
        .string()
        .regex(/^\d{4}-\d{2}$/, "Le format du mois doit être YYYY-MM"),
    globalLimit: zod_1.z.number().nonnegative(),
    categoryBudgets: zod_1.z.array(zod_1.z.object({
        categoryId: zod_1.z.number().int().positive(),
        limit: zod_1.z.number().nonnegative(),
        isDisabled: zod_1.z.boolean().optional().default(false),
    })),
});
const getBudget = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { month } = req.query;
        const validatedMonth = monthSchema.parse(month);
        // Return budget details, potentially with default flag
        const result = yield budgetService.getBudgetOrDefault(validatedMonth);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
});
exports.getBudget = getBudget;
const setBudget = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = setBudgetSchema.parse(req.body);
        const result = yield budgetService.setBudget(validatedData);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
});
exports.setBudget = setBudget;

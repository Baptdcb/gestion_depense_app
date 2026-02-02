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
exports.deleteExpense = exports.updateExpense = exports.getSummary = exports.listExpenses = exports.addExpense = void 0;
const expenseService = __importStar(require("../services/expense.service"));
const recurringService = __importStar(require("../services/recurringExpense.service"));
const zod_1 = require("zod");
const monthSchema = zod_1.z
    .string()
    .regex(/^\d{4}-\d{2}$/, "Le format du mois doit être YYYY-MM");
const yearSchema = zod_1.z
    .string()
    .regex(/^\d{4}$/, "Le format de l'année doit être YYYY");
const createExpenseSchema = zod_1.z.object({
    montant: zod_1.z.number().positive("Le montant doit être positif"),
    description: zod_1.z.string().optional(),
    date: zod_1.z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "La date doit être au format YYYY-MM-DD"),
    categorieId: zod_1.z.number().int().positive(),
    type: zod_1.z.enum(["expense", "refund"]).optional(),
});
const updateExpenseSchema = zod_1.z.object({
    montant: zod_1.z.number().positive().optional(),
    description: zod_1.z.string().nullable().optional(),
    date: zod_1.z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "La date doit être au format YYYY-MM-DD")
        .optional(),
    categorieId: zod_1.z.number().int().positive().optional(),
    type: zod_1.z.enum(["expense", "refund"]).optional(),
});
const addExpense = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = createExpenseSchema.parse(req.body);
        const expense = yield expenseService.createExpense(Object.assign(Object.assign({}, validatedData), { date: new Date(validatedData.date), type: validatedData.type }));
        res.status(201).json(expense);
    }
    catch (error) {
        next(error);
    }
});
exports.addExpense = addExpense;
const listExpenses = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { month, year } = req.query;
        if (month) {
            const validatedMonth = monthSchema.parse(month);
            yield recurringService.ensureRecurringExpensesForMonth(validatedMonth);
            const expenses = yield expenseService.getExpensesByMonth(validatedMonth);
            res.json(expenses);
            return;
        }
        if (year) {
            const validatedYear = Number(yearSchema.parse(year));
            yield recurringService.ensureRecurringExpensesForYear(validatedYear);
            const expenses = yield expenseService.getExpensesByYear(validatedYear);
            res.json(expenses);
            return;
        }
        res.status(400).json({ message: "Paramètre month ou year requis." });
    }
    catch (error) {
        next(error);
    }
});
exports.listExpenses = listExpenses;
const getSummary = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { month, year } = req.query;
        if (month) {
            const validatedMonth = monthSchema.parse(month);
            const summary = yield expenseService.getMonthlySummary(validatedMonth);
            res.json(summary);
            return;
        }
        if (year) {
            const validatedYear = Number(yearSchema.parse(year));
            const summary = yield expenseService.getYearlySummary(validatedYear);
            res.json(summary);
            return;
        }
        res.status(400).json({ message: "Paramètre month ou year requis." });
    }
    catch (error) {
        next(error);
    }
});
exports.getSummary = getSummary;
const updateExpense = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const validatedData = updateExpenseSchema.parse(req.body);
        const expense = yield expenseService.updateExpense(id, Object.assign(Object.assign({}, validatedData), { date: validatedData.date ? new Date(validatedData.date) : undefined }));
        res.json(expense);
    }
    catch (error) {
        next(error);
    }
});
exports.updateExpense = updateExpense;
const deleteExpense = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const expense = yield expenseService.deleteExpense(id);
        res.json(expense);
    }
    catch (error) {
        next(error);
    }
});
exports.deleteExpense = deleteExpense;

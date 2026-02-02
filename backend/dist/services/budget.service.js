"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setBudget = exports.getBudgetOrDefault = exports.getBudget = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const date_fns_1 = require("date-fns");
const getBudget = (month) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Try to find the budget for the requested month
    const budget = yield prisma_1.default.monthlyBudget.findUnique({
        where: { month },
        include: {
            categoryBudgets: {
                include: {
                    category: true,
                },
            },
        },
    });
    if (budget) {
        return budget;
    }
    // 2. If not found, try to find the previous month's budget to use as default values
    // But do NOT create it yet. The frontend will pre-fill the form with these values.
    const date = new Date(`${month}-01`); // YYYY-MM-01
    const previousMonth = (0, date_fns_1.format)((0, date_fns_1.subMonths)(date, 1), "yyyy-MM");
    const previousBudget = yield prisma_1.default.monthlyBudget.findUnique({
        where: { month: previousMonth },
        include: {
            categoryBudgets: {
                include: {
                    category: true,
                },
            },
        },
    });
    if (previousBudget) {
        // Return structured like a budget but indicate it's from previous month?
        // Or simply let the caller handle it.
        // Let's simpler: Just return null and handle "fetch previous" in a separate specific call if needed?
        // User Requirement: "Option B: Reuse previous".
        // It is better to have a specific endpoint or flag to "get suggestions" if actual doesn't exist.
        // However, for simplicity, let's return null here. The frontend will treat null as "No budget set".
        // When the user opens the "Set Budget" modal, we can have logic to fetch defaults.
        return null;
    }
    return null;
});
exports.getBudget = getBudget;
// Helper to get budget OR defaults if missing
const getBudgetOrDefault = (month) => __awaiter(void 0, void 0, void 0, function* () {
    const budget = yield prisma_1.default.monthlyBudget.findUnique({
        where: { month },
        include: {
            categoryBudgets: {
                include: { category: true },
            },
        },
    });
    if (budget)
        return { budget, isDefault: false };
    // Fetch previous month for defaults
    const date = new Date(`${month}-01`);
    const previousMonth = (0, date_fns_1.format)((0, date_fns_1.subMonths)(date, 1), "yyyy-MM");
    const previousBudget = yield prisma_1.default.monthlyBudget.findUnique({
        where: { month: previousMonth },
        include: {
            categoryBudgets: {
                include: { category: true },
            },
        },
    });
    if (previousBudget) {
        // Transform to remove IDs specific to previous month so it acts as a template
        return { budget: previousBudget, isDefault: true };
    }
    return { budget: null, isDefault: false };
});
exports.getBudgetOrDefault = getBudgetOrDefault;
const setBudget = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { month, globalLimit, categoryBudgets } = data;
    // Use transaction to ensure consistency
    return yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        // 1. Upsert Monthly Budget
        const monthlyBudget = yield tx.monthlyBudget.upsert({
            where: { month },
            update: { globalLimit },
            create: { month, globalLimit },
        });
        // 2. Upsert Category Budgets
        // We delete existing ones for this month to cleanly replace with new set (handling removals if any)
        // Or strictly upsert. Deleting and recreating is often easier for bulk updates via forms.
        // Let's go with delete-all-for-month-and-recreate approach for simplicity and correctness of "state sync"
        // Wait, deleting might lose history if we track history? No, history is MonthlyBudget specific.
        // This is safe.
        yield tx.categoryBudget.deleteMany({
            where: { monthlyBudgetId: monthlyBudget.id },
        });
        if (categoryBudgets.length > 0) {
            yield tx.categoryBudget.createMany({
                data: categoryBudgets.map((cb) => {
                    var _a;
                    return ({
                        monthlyBudgetId: monthlyBudget.id,
                        categoryId: cb.categoryId,
                        limit: cb.limit,
                        isDisabled: (_a = cb.isDisabled) !== null && _a !== void 0 ? _a : false,
                    });
                }),
            });
        }
        // Return full object
        return yield tx.monthlyBudget.findUnique({
            where: { id: monthlyBudget.id },
            include: {
                categoryBudgets: {
                    include: { category: true },
                },
            },
        });
    }));
});
exports.setBudget = setBudget;

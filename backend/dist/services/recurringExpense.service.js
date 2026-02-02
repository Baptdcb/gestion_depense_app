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
exports.ensureRecurringExpensesForYear = exports.ensureRecurringExpensesForMonth = exports.deleteRecurringExpense = exports.updateRecurringExpense = exports.createRecurringExpense = exports.listRecurringExpenses = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const date_fns_1 = require("date-fns");
const monthFromDate = (date) => (0, date_fns_1.format)(date, "yyyy-MM");
const listRecurringExpenses = () => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.recurringExpense.findMany({
        include: { categorie: true },
        orderBy: { createdAt: "desc" },
    });
});
exports.listRecurringExpenses = listRecurringExpenses;
const createRecurringExpense = (data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    return prisma_1.default.recurringExpense.create({
        data: {
            montant: data.montant,
            description: data.description,
            categorieId: data.categorieId,
            active: (_a = data.active) !== null && _a !== void 0 ? _a : true,
            startDate: (_b = data.startDate) !== null && _b !== void 0 ? _b : new Date(),
        },
        include: { categorie: true },
    });
});
exports.createRecurringExpense = createRecurringExpense;
const updateRecurringExpense = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.recurringExpense.update({
        where: { id },
        data: Object.assign({}, data),
        include: { categorie: true },
    });
});
exports.updateRecurringExpense = updateRecurringExpense;
const deleteRecurringExpense = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // Delete instances from the current month and future only
    const now = new Date();
    const currentMonth = monthFromDate(now);
    yield prisma_1.default.expense.deleteMany({
        where: {
            recurringExpenseId: id,
            mois: { gte: currentMonth },
        },
    });
    return prisma_1.default.recurringExpense.delete({
        where: { id },
    });
});
exports.deleteRecurringExpense = deleteRecurringExpense;
const ensureRecurringExpensesForMonth = (month) => __awaiter(void 0, void 0, void 0, function* () {
    const recurring = yield prisma_1.default.recurringExpense.findMany({
        where: { active: true },
    });
    if (recurring.length === 0)
        return;
    const existing = yield prisma_1.default.expense.findMany({
        where: {
            mois: month,
            recurringExpenseId: { not: null },
        },
        select: { recurringExpenseId: true },
    });
    const existingIds = new Set(existing.map((e) => e.recurringExpenseId).filter(Boolean));
    const targetDate = new Date(`${month}-01T00:00:00.000Z`);
    const today = new Date();
    yield Promise.all(recurring.map((rec) => __awaiter(void 0, void 0, void 0, function* () {
        const recStartDate = new Date(rec.startDate);
        const recStartMonth = monthFromDate(recStartDate);
        // Ne pas créer avant le mois de départ
        if (month < recStartMonth)
            return;
        // Ne créer la dépense que si le mois a commencé
        if (targetDate > today)
            return;
        // Ne créer la dépense que si aujourd'hui >= startDate
        if (today < recStartDate)
            return;
        if (existingIds.has(rec.id))
            return;
        yield prisma_1.default.expense.create({
            data: {
                montant: rec.montant,
                description: rec.description,
                date: targetDate,
                mois: month,
                categorieId: rec.categorieId,
                recurringExpenseId: rec.id,
            },
        });
    })));
});
exports.ensureRecurringExpensesForMonth = ensureRecurringExpensesForMonth;
const ensureRecurringExpensesForYear = (year) => __awaiter(void 0, void 0, void 0, function* () {
    const now = new Date();
    const isCurrentYear = now.getFullYear() === year;
    const lastMonth = isCurrentYear ? now.getMonth() + 1 : 12;
    for (let month = 1; month <= lastMonth; month += 1) {
        const monthString = `${year}-${String(month).padStart(2, "0")}`;
        yield (0, exports.ensureRecurringExpensesForMonth)(monthString);
    }
});
exports.ensureRecurringExpensesForYear = ensureRecurringExpensesForYear;

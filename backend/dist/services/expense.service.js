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
exports.getYearlySummary = exports.getMonthlySummary = exports.getExpensesByYear = exports.getExpensesByMonth = exports.deleteExpense = exports.updateExpense = exports.createExpense = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const date_fns_1 = require("date-fns");
const createExpense = (data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const mois = (0, date_fns_1.format)(new Date(data.date), "yyyy-MM");
    return prisma_1.default.expense.create({
        data: Object.assign(Object.assign({}, data), { montant: data.montant, mois, type: (_a = data.type) !== null && _a !== void 0 ? _a : "expense" }),
    });
});
exports.createExpense = createExpense;
const updateExpense = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedData = Object.assign({}, data);
    if (data.date) {
        updatedData.mois = (0, date_fns_1.format)(new Date(data.date), "yyyy-MM");
    }
    return prisma_1.default.expense.update({
        where: { id },
        data: updatedData,
        include: { categorie: true },
    });
});
exports.updateExpense = updateExpense;
const deleteExpense = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.expense.delete({
        where: { id },
    });
});
exports.deleteExpense = deleteExpense;
const getExpensesByMonth = (month) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.expense.findMany({
        where: {
            mois: month,
        },
        include: {
            categorie: true, // Include category details
        },
        orderBy: {
            date: "desc",
        },
    });
});
exports.getExpensesByMonth = getExpensesByMonth;
const getExpensesByYear = (year) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.expense.findMany({
        where: {
            date: {
                gte: new Date(`${year}-01-01T00:00:00.000Z`),
                lt: new Date(`${year + 1}-01-01T00:00:00.000Z`),
            },
        },
        include: {
            categorie: true,
        },
        orderBy: {
            date: "desc",
        },
    });
});
exports.getExpensesByYear = getExpensesByYear;
const getMonthlySummary = (month) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.expense.groupBy({
        by: ["categorieId"],
        where: {
            mois: month,
        },
        _sum: {
            montant: true,
        },
    });
    // To get category details, we need another query
    const categoryIds = result.map((item) => item.categorieId);
    const categories = yield prisma_1.default.category.findMany({
        where: {
            id: {
                in: categoryIds,
            },
        },
    });
    const categoryMap = new Map(categories.map((c) => [c.id, c]));
    return result.map((item) => ({
        categorie: categoryMap.get(item.categorieId),
        total: item._sum.montant,
    }));
});
exports.getMonthlySummary = getMonthlySummary;
const getYearlySummary = (year) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.expense.groupBy({
        by: ["categorieId"],
        where: {
            date: {
                gte: new Date(`${year}-01-01T00:00:00.000Z`),
                lt: new Date(`${year + 1}-01-01T00:00:00.000Z`),
            },
        },
        _sum: {
            montant: true,
        },
    });
    const categoryIds = result.map((item) => item.categorieId);
    const categories = yield prisma_1.default.category.findMany({
        where: {
            id: {
                in: categoryIds,
            },
        },
    });
    const categoryMap = new Map(categories.map((c) => [c.id, c]));
    return result.map((item) => ({
        categorie: categoryMap.get(item.categorieId),
        total: item._sum.montant,
    }));
});
exports.getYearlySummary = getYearlySummary;

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
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getAllCategories = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const getAllCategories = () => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.category.findMany();
});
exports.getAllCategories = getAllCategories;
const createCategory = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.category.create({
        data,
    });
});
exports.createCategory = createCategory;
const updateCategory = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.category.update({
        where: { id },
        data,
    });
});
exports.updateCategory = updateCategory;
const deleteCategory = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const expensesCount = yield prisma_1.default.expense.count({
        where: { categorieId: id },
    });
    if (expensesCount > 0) {
        let otherCategory = yield prisma_1.default.category.findUnique({
            where: { nom: "Autres" },
        });
        if (!otherCategory) {
            otherCategory = yield prisma_1.default.category.create({
                data: {
                    nom: "Autres",
                    icone: "FaQuestion",
                    couleur: "#94a3b8",
                },
            });
        }
        if (otherCategory.id === id) {
            throw new Error("Impossible  supprimer la catégorie 'Autres' car elle contient des dépenses.");
        }
        yield prisma_1.default.expense.updateMany({
            where: { categorieId: id },
            data: { categorieId: otherCategory.id },
        });
    }
    return prisma_1.default.category.delete({
        where: { id },
    });
});
exports.deleteCategory = deleteCategory;

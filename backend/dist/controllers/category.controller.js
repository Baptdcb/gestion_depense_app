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
exports.deleteCategory = exports.updateCategory = exports.addCategory = exports.listCategories = void 0;
const categoryService = __importStar(require("../services/category.service"));
const zod_1 = require("zod");
const createCategorySchema = zod_1.z.object({
    nom: zod_1.z.string().min(1, "Le nom est requis"),
    icone: zod_1.z.string().min(1, "L'icône est requise"),
    couleur: zod_1.z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Couleur invalide"),
});
const updateCategorySchema = createCategorySchema.partial();
const listCategories = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield categoryService.getAllCategories();
        res.json(categories);
    }
    catch (error) {
        next(error);
    }
});
exports.listCategories = listCategories;
const addCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = createCategorySchema.parse(req.body);
        const newCategory = yield categoryService.createCategory(validatedData);
        res.status(201).json(newCategory);
    }
    catch (error) {
        next(error);
    }
});
exports.addCategory = addCategory;
const updateCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const validatedData = updateCategorySchema.parse(req.body);
        const updatedCategory = yield categoryService.updateCategory(id, validatedData);
        res.json(updatedCategory);
    }
    catch (error) {
        next(error);
    }
});
exports.updateCategory = updateCategory;
const deleteCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        yield categoryService.deleteCategory(id);
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
});
exports.deleteCategory = deleteCategory;

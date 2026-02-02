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
exports.deleteRecurringExpense = exports.updateRecurringExpense = exports.createRecurringExpense = exports.listRecurringExpenses = void 0;
const zod_1 = require("zod");
const recurringService = __importStar(require("../services/recurringExpense.service"));
const createRecurringSchema = zod_1.z.object({
    montant: zod_1.z.number().positive("Le montant doit être positif"),
    description: zod_1.z.string().optional(),
    categorieId: zod_1.z.number().int().positive(),
    active: zod_1.z.boolean().optional(),
    startDate: zod_1.z.string().optional(),
});
const updateRecurringSchema = zod_1.z.object({
    montant: zod_1.z.number().positive().optional(),
    description: zod_1.z.string().nullable().optional(),
    categorieId: zod_1.z.number().int().positive().optional(),
    active: zod_1.z.boolean().optional(),
    startDate: zod_1.z.string().optional(),
});
const listRecurringExpenses = (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const items = yield recurringService.listRecurringExpenses();
        res.json(items);
    }
    catch (error) {
        next(error);
    }
});
exports.listRecurringExpenses = listRecurringExpenses;
const createRecurringExpense = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validated = createRecurringSchema.parse(req.body);
        const created = yield recurringService.createRecurringExpense({
            montant: validated.montant,
            description: validated.description,
            categorieId: validated.categorieId,
            active: validated.active,
            startDate: validated.startDate
                ? new Date(validated.startDate)
                : undefined,
        });
        res.status(201).json(created);
    }
    catch (error) {
        next(error);
    }
});
exports.createRecurringExpense = createRecurringExpense;
const updateRecurringExpense = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const validated = updateRecurringSchema.parse(req.body);
        const updated = yield recurringService.updateRecurringExpense(id, Object.assign(Object.assign({}, validated), { startDate: validated.startDate
                ? new Date(validated.startDate)
                : undefined }));
        res.json(updated);
    }
    catch (error) {
        next(error);
    }
});
exports.updateRecurringExpense = updateRecurringExpense;
const deleteRecurringExpense = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const deleted = yield recurringService.deleteRecurringExpense(id);
        res.json(deleted);
    }
    catch (error) {
        next(error);
    }
});
exports.deleteRecurringExpense = deleteRecurringExpense;

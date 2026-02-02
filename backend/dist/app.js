"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const category_routes_1 = __importDefault(require("./routes/category.routes"));
const expense_routes_1 = __importDefault(require("./routes/expense.routes"));
const budget_routes_1 = __importDefault(require("./routes/budget.routes"));
const setting_routes_1 = __importDefault(require("./routes/setting.routes"));
const report_routes_1 = __importDefault(require("./routes/report.routes"));
const recurringExpense_routes_1 = __importDefault(require("./routes/recurringExpense.routes"));
const errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
const app = (0, express_1.default)();
// Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// API Routes
app.use("/api/categories", category_routes_1.default);
app.use("/api/expenses", expense_routes_1.default);
app.use("/api/budgets", budget_routes_1.default);
app.use("/api/settings", setting_routes_1.default);
app.use("/api/reports", report_routes_1.default);
app.use("/api/recurring-expenses", recurringExpense_routes_1.default);
// Error handling middleware
app.use(errorHandler_1.default);
exports.default = app;

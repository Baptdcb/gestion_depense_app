import express from "express";
import cors from "cors";
import categoryRoutes from "./routes/category.routes";
import expenseRoutes from "./routes/expense.routes";
import budgetRoutes from "./routes/budget.routes";
import settingRoutes from "./routes/setting.routes";
import reportRoutes from "./routes/report.routes";
import errorHandler from "./middlewares/errorHandler";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/categories", categoryRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/settings", settingRoutes);
app.use("/api/reports", reportRoutes);

// Error handling middleware
app.use(errorHandler);

export default app;

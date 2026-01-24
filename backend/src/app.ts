import express from "express";
import cors from "cors";
import categoryRoutes from "./routes/category.routes";
import expenseRoutes from "./routes/expense.routes";
import errorHandler from "./middlewares/errorHandler";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/categories", categoryRoutes);
app.use("/api/expenses", expenseRoutes);

// Error handling middleware
app.use(errorHandler);

export default app;

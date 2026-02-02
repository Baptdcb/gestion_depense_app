"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const errorHandler = (err, req, res, next) => {
    console.error(err);
    if (err instanceof zod_1.ZodError) {
        return res.status(400).json({
            message: 'Erreur de validation',
            errors: err.errors.map(e => ({ path: e.path, message: e.message })),
        });
    }
    // Handle Prisma errors specifically if needed
    // Ex: if (err.code === 'P2002') { ... }
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Erreur interne du serveur';
    res.status(statusCode).json({
        message,
        stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
    });
};
exports.default = errorHandler;

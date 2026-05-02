import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error("\n❌ === ERROR DETAILS ===");
  console.error("Name:", err.name);
  console.error("Message:", err.message);
  console.error("SQL:", err.sql);
  console.error("Original:", err.original?.message);
  console.error("Code:", err.original?.code);
  console.error("Detail:", err.original?.detail);
  console.error("Hint:", err.original?.hint);
  console.error("Stack:", err.stack);
  console.error("======================\n");

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    sql: err.sql,
    detail: err.original?.detail,
  });
};
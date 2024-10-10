import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

console.log("Custom express types loaded!");


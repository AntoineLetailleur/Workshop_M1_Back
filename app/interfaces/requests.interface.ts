import { Request } from "express";
export interface RequestTest extends Request {
  userId: string;
}

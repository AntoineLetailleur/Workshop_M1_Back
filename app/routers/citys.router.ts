import express from "express";
import { Role } from "@prisma/client";
import cityController from "../controllers/citys.controller";

const router = express.Router();

router.post("/city", cityController.addNewCity);

export default router;

import express from "express";
import usersController from "../controllers/users.controller";
import { Role } from "@prisma/client";

const router = express.Router();

router.post("/users/auth", usersController.login);
router.patch("/users/updateCity", usersController.updateCity)

export default router;

import express from "express";
import usersController from "../controllers/users.controller";


const router = express.Router();

router.post("/users/auth", usersController.login);
router.patch("/users/cities", usersController.validateRequest(['ADMIN', 'USER', 'DOCTOR']), usersController.updateCity);
router.get("/users/infos", usersController.validateRequest(['USER', 'DOCTOR', 'ADMIN']), usersController.getUserInfos);
router.post("/users", usersController.createUser);

export default router;

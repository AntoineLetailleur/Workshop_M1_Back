import express from 'express';
import usersController from "../controllers/User.controller";


const router = express.Router();


router.get("/users", usersController.getAll);

/*
router.post("/users", usersController.createUser);
router.post("/users/auth", usersController.login);
router.post("/users/botanists", usersController.validateRequest(['ADMIN']), usersController.createBotanist);
router.get("/users/infos", usersController.validateRequest(['ADMIN', 'UTILISATEUR', 'BOTANISTE']), usersController.getUserInfos);
*/

export default router
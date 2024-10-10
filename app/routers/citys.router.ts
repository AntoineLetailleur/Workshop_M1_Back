import express from "express";
import cityController from "../controllers/citys.controller";
import usersController from "../controllers/users.controller";


const router = express.Router();

router.post("/city", usersController.validateRequest(["USER", "DOCTOR", "ADMIN"]), cityController.addNewCity);

export default router;

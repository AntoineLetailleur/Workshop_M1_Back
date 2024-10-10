import express from "express";
import requestsController from "../controllers/requests.controller";
import usersController from "../controllers/users.controller";


const router = express.Router();

router.post("/request", usersController.validateRequest(['USER', 'DOCTOR', 'ADMIN']), requestsController.addNewRequest);

export default router;
    
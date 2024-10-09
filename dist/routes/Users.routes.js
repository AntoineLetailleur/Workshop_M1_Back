"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_controller_1 = __importDefault(require("../controllers/User.controller"));
const router = express_1.default.Router();
router.get("/users", User_controller_1.default.getAll);
/*
router.post("/users", usersController.createUser);
router.post("/users/auth", usersController.login);
router.post("/users/botanists", usersController.validateRequest(['ADMIN']), usersController.createBotanist);
router.get("/users/infos", usersController.validateRequest(['ADMIN', 'UTILISATEUR', 'BOTANISTE']), usersController.getUserInfos);
*/
exports.default = router;

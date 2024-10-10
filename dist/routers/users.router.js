"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_controller_1 = __importDefault(require("../controllers/users.controller"));
const router = express_1.default.Router();
router.post("/users/auth", users_controller_1.default.login);
router.patch("/users/updateCity", users_controller_1.default.validateRequest(['ADMIN', 'USER', 'DOCTOR']), users_controller_1.default.updateCity);
router.get("/users/infos", users_controller_1.default.validateRequest(['USER', 'DOCTOR', 'ADMIN']), users_controller_1.default.getUserInfos);
exports.default = router;

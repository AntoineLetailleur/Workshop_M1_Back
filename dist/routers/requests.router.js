"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const requests_controller_1 = __importDefault(require("../controllers/requests.controller"));
const users_controller_1 = __importDefault(require("../controllers/users.controller"));
const router = express_1.default.Router();
router.post("/requests", users_controller_1.default.validateRequest(['USER', 'DOCTOR', 'ADMIN']), requests_controller_1.default.addNewRequest);
exports.default = router;

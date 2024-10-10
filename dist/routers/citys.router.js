"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const citys_controller_1 = __importDefault(require("../controllers/citys.controller"));
const users_controller_1 = __importDefault(require("../controllers/users.controller"));
const router = express_1.default.Router();
router.post("/city", users_controller_1.default.validateRequest(["DOCTOR", "ADMIN"]), citys_controller_1.default.addNewCity);
exports.default = router;

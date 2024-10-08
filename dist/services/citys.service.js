"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class CityService {
    addNewCity(postal, name, x, y) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const city = yield prisma.cities.create({
                    data: {
                        postal: postal,
                        name: name,
                        x: x,
                        y: y
                    }
                });
                return city;
            }
            catch (error) {
                throw new Error(`Error during connection: ${error.message}`);
            }
        });
    }
    findByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const city = yield prisma.cities.findFirst({
                    where: {
                        name: name
                    }
                });
                return city;
            }
            catch (error) {
                throw new Error(`Error during connection: ${error.message}`);
            }
        });
    }
}
exports.default = CityService;
module.exports = CityService;

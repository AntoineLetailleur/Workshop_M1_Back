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
class UsersService {
    connection(_a) {
        return __awaiter(this, arguments, void 0, function* ({ email }) {
            try {
                const user = yield prisma.users.findUnique({
                    where: {
                        email: email,
                    },
                    include: {
                        role: true,
                    },
                });
                return { user };
            }
            catch (error) {
                throw new Error(`Error during connection: ${error.message}`);
            }
        });
    }
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield prisma.users.findUnique({
                    where: {
                        email: email,
                    },
                });
                return user;
            }
            catch (error) {
                throw new Error(`Error finding user by email: ${error.message}`);
            }
        });
    }
    createUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newUser = yield prisma.users.create({
                    data: {
                        email: userData.email,
                        password: userData.password,
                        pseudo: userData.pseudo,
                        ville: userData.ville,
                        codePostal: userData.codePostal,
                        roleId: userData.roleId,
                    },
                    select: {
                        id: true,
                        password: false,
                        email: true,
                        pseudo: true,
                        ville: true,
                        codePostal: true,
                        roleId: true,
                        role: true,
                    },
                });
                return newUser;
            }
            catch (error) {
                throw new Error(`Error creating user: ${error.message}`);
            }
        });
    }
}
exports.default = UsersService;
module.exports = UsersService;

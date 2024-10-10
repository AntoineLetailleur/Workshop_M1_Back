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
                    }
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
    findUserById(idUser) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield prisma.users.findUnique({
                    where: {
                        id: idUser
                    }
                });
                return user;
            }
            catch (error) {
                throw new Error(`Error during connection: ${error.message}`);
            }
        });
    }
    updateCityById(idUser, cityId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updateUser = yield prisma.users.update({
                    where: {
                        id: idUser,
                    },
                    data: {
                        cityId: cityId,
                    },
                });
                return updateUser;
            }
            catch (error) {
                throw new Error(`Error during connection: ${error.message}`);
            }
        });
    }
    getUserInfos(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield prisma.users.findUnique({
                    where: {
                        id: id,
                    },
                    select: {
                        email: true,
                        role: true,
                        city: {
                            select: {
                                name: true,
                                postal: true,
                                x: true,
                                y: true,
                            },
                        },
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
                        role: userData.role,
                        cityId: userData.cityId,
                    },
                    select: {
                        id: true,
                        email: true,
                        role: true,
                        password: false,
                        city: true
                    }
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

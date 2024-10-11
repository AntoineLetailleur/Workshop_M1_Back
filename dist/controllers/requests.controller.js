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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_service_1 = __importDefault(require("../services/users.service"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const userService = new users_service_1.default();
const requestsController = {
    addNewRequest: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        try {
            const token = (_b = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split("Bearer ")[1]) !== null && _b !== void 0 ? _b : '';
            if (!token) {
                return res.sendStatus(401);
            }
            const decodedToken = jsonwebtoken_1.default.decode(token);
            if (!decodedToken) {
                return res.sendStatus(403);
            }
            const userId = decodedToken.userId;
            console.log("userId is " + userId);
            const { serviceType } = req.body;
            const myUser = yield userService.findUserById(userId);
            const cityId = myUser === null || myUser === void 0 ? void 0 : myUser.cityId;
            const userList = yield prisma.requests.findMany({
                where: {
                    service: serviceType,
                    cityId: cityId
                },
                select: {
                    user: {
                        select: { id: true }
                    }
                }
            });
            if (userList.length > 0) {
                var foundUser = false;
                for (const request of userList) {
                    for (const user of request.user) {
                        console.log("User ID:", user.id);
                        if (user.id === userId) {
                            foundUser = true;
                        }
                    }
                }
                if (foundUser) {
                    console.log("L'utilisateur a déjà exprimé cette demande !");
                    return res.status(500).send("Cette demande a déjà été envoyée...");
                }
                else {
                    console.log("L'utilisateur se joint à une demande déjà exprimée");
                    const updatedRequest = yield prisma.requests.update({
                        where: {
                            service: serviceType,
                            cityId: cityId
                        },
                        data: {
                            user: {
                                connect: { id: userId }
                            }
                        }
                    });
                    console.log("Demande mise à jour avec succès :", updatedRequest);
                    return res.status(200).send("L'utilisateur a été ajouté à la demande.");
                }
            }
            else {
                console.log("L'utilisateur exprime une nouvelle requête");
                const request = yield prisma.requests.create({
                    data: {
                        service: serviceType,
                        cityId: cityId,
                        user: {
                            connect: { id: userId }
                        },
                        isAccepted: false
                    }
                });
                console.log(request);
                return res.status(200).send(request);
            }
        }
        catch (error) {
            console.error(error);
        }
    })
};
exports.default = requestsController;

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
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const userService = new users_service_1.default();
const requestsController = {
    addNewRequest: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { userId, serviceType } = req.body;
            const myUser = yield userService.findUserById(userId);
            const cityId = myUser === null || myUser === void 0 ? void 0 : myUser.cityId;
            const userList = yield prisma.requests.findMany({
                where: {
                    service: serviceType,
                    cityId: cityId
                },
                select: {
                    user: {
                        select: { id: true } // Sélectionne uniquement l'ID des utilisateurs
                    }
                }
            });
            // Récupération de la liste des users pour une requête
            if (userList.length > 0) {
                // Itérer sur userList et vérifier les IDs
                var foundUser = false;
                for (const request of userList) {
                    for (const user of request.user) {
                        console.log("User ID:", user.id); // Affiche chaque ID utilisateur
                        // Vérifiez si l'utilisateur a l'ID que vous recherchez
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
                    // Ajout de l'utilisateur à la liste en base de données
                    const updatedRequest = yield prisma.requests.update({
                        where: {
                            service: serviceType,
                            cityId: cityId
                        },
                        data: {
                            user: {
                                connect: { id: userId } // Connexion de l'utilisateur avec l'ID correspondant
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

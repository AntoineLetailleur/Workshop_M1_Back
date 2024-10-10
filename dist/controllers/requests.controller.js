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
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const requestsController = {
    addNewRequest: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { userId, serviceType, cityId } = req.body;
            const userList = prisma.request.findMany({
                where: {
                    serviceId: serviceType,
                    cityId: cityId
                },
                select: {
                    users: true
                }
            });
            console.log("userList: ", userList);
            if (userList.length > 0) {
                // La liste des utilisateurs n'est pas vide
                console.log("Il y a des utilisateurs :", userList);
            }
            else {
                // La liste des utilisateurs est vide
                console.log("Aucun utilisateur trouvé.");
                const request = prisma.request.create({
                    data: {
                        serviceId: serviceType,
                        cityId: cityId,
                        users: userId
                    },
                    select: {
                        id: true,
                        answerId: true,
                        serviceId: true,
                        cityId: true
                    }
                });
                console.log("Request :", JSON.stringify(request, null, 2));
                return res.status(200).send(request);
            }
            return res.status(200);
        }
        catch (error) {
            console.error(error);
        }
    })
};
exports.default = requestsController;

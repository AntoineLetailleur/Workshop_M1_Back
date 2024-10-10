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
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // Ajout des villes
        const carvin = yield prisma.cities.create({
            data: {
                postal: 62220,
                name: 'Carvin',
                x: 50,
                y: 3,
            },
        });
        const lille = yield prisma.cities.create({
            data: {
                postal: 59000,
                name: 'Lille',
                x: 50,
                y: 3,
            },
        });
        // Ajout des utilisateurs
        const daniel = yield prisma.users.create({
            data: {
                email: 'daniel@gmail.com',
                password: 'password123', // Mettez ici un vrai hash pour la sécurité
                role: 'DOCTOR',
                cityId: carvin.id,
                doctor: {
                    create: {
                        service: 'cardiology',
                    },
                },
            },
        });
        const axel = yield prisma.users.create({
            data: {
                email: 'axel@gmail.com',
                password: 'password123',
                role: 'USER',
                cityId: lille.id,
            },
        });
        const antoine = yield prisma.users.create({
            data: {
                email: 'antoine@gmail.com',
                password: 'password123',
                role: 'ADMIN',
                cityId: lille.id,
            },
        });
        // Ajout de la requête
        yield prisma.requests.create({
            data: {
                service: 'cardiology',
                isAccepted: false,
                cityId: carvin.id,
            },
        });
    });
}
main()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}))
    .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
    console.error(e);
    yield prisma.$disconnect();
    process.exit(1);
}));

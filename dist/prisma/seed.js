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
const client_1 = require("@prisma/client");
const crypto_1 = __importDefault(require("crypto"));
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // Créer des villes
        const city1 = yield prisma.city.create({
            data: {
                postal: 75001,
                name: "Paris",
                x: 48,
                y: 2,
            },
        });
        const city2 = yield prisma.city.create({
            data: {
                postal: 13001,
                name: "Marseille",
                x: 43,
                y: 5,
            },
        });
        // Créer des services
        const service1 = yield prisma.service.create({
            data: {},
        });
        const service2 = yield prisma.service.create({
            data: {},
        });
        // Créer des utilisateurs
        const user1 = yield prisma.user.create({
            data: {
                email: "user1@example.com",
                password: crypto_1.default.createHash("sha256").update("password123").digest("hex"),
                role: 'USER',
                city: {
                    connect: { id: city1.id },
                },
            },
        });
        const user2 = yield prisma.user.create({
            data: {
                email: "user2@example.com",
                password: crypto_1.default.createHash("sha256").update("password456").digest("hex"),
                role: 'USER',
                city: {
                    connect: { id: city2.id },
                },
            },
        });
        // Créer des docteurs
        const doctor1 = yield prisma.doctor.create({
            data: {
                user: {
                    connect: { id: user1.id },
                },
                service: {
                    connect: { id: service1.id },
                },
            },
        });
        const doctor2 = yield prisma.doctor.create({
            data: {
                user: {
                    connect: { id: user2.id },
                },
                service: {
                    connect: { id: service2.id },
                },
            },
        });
        // Créer des réponses (Answer)
        const answer1 = yield prisma.answer.create({
            data: {
                doctor: {
                    connect: { id: doctor1.id },
                },
                start_date: new Date('2023-01-01T10:00:00Z'),
                end_date: new Date('2023-01-01T12:00:00Z'),
                seats: 10,
                patients: {
                    connect: [{ id: user1.id }, { id: user2.id }],
                },
            },
        });
        const answer2 = yield prisma.answer.create({
            data: {
                doctor: {
                    connect: { id: doctor2.id },
                },
                start_date: new Date('2023-02-01T14:00:00Z'),
                end_date: new Date('2023-02-01T16:00:00Z'),
                seats: 15,
                patients: {
                    connect: [{ id: user2.id }],
                },
            },
        });
        // Créer des requêtes (Request)
        const request1 = yield prisma.request.create({
            data: {
                answer: {
                    connect: { id: answer1.id },
                },
                service: {
                    connect: { id: service1.id },
                },
                city: {
                    connect: { id: city1.id },
                },
            },
        });
        const request2 = yield prisma.request.create({
            data: {
                answer: {
                    connect: { id: answer2.id },
                },
                service: {
                    connect: { id: service2.id },
                },
                city: {
                    connect: { id: city2.id },
                },
            },
        });
        console.log('Seeding terminé!');
        yield prisma.$disconnect();
    });
}
main();

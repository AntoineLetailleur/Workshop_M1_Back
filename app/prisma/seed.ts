import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

async function main() {

  // Créer des villes
  const city1 = await prisma.city.create({
    data: {
      postal: 75001,
      name: "Paris",
      x: 48,
      y: 2,
    },
  });

  const city2 = await prisma.city.create({
    data: {
      postal: 13001,
      name: "Marseille",
      x: 43,
      y: 5,
    },
  });

  // Créer des services
  const service1 = await prisma.service.create({
    data: {},
  });

  const service2 = await prisma.service.create({
    data: {},
  });

  // Créer des utilisateurs
  const user1 = await prisma.user.create({
    data: {
      email: "user1@example.com",
      password: crypto.createHash("sha256").update("password123").digest("hex"),
      role: 'USER',
      city: {
        connect: { id: city1.id },
      },
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: "user2@example.com",
      password: crypto.createHash("sha256").update("password456").digest("hex"),
      role: 'USER',
      city: {
        connect: { id: city2.id },
      },
    },
  });

  // Créer des docteurs
  const doctor1 = await prisma.doctor.create({
    data: {
      user: {
        connect: { id: user1.id },
      },
      service: {
        connect: { id: service1.id },
      },
    },
  });

  const doctor2 = await prisma.doctor.create({
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
  const answer1 = await prisma.answer.create({
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

  const answer2 = await prisma.answer.create({
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
  const request1 = await prisma.request.create({
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

  const request2 = await prisma.request.create({
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

  await prisma.$disconnect();
}

main();

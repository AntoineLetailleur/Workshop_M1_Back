import { PrismaClient } from "@prisma/client";
import crypto from "crypto";


const prisma = new PrismaClient();

async function main() : Promise<void> {
  // Créer des villes
  const city1 = await prisma.cities.create({
    data: {
      postal: 75001,
      name: "Paris",
      x: 48,
      y: 2,
    },
  });

  const city2 = await prisma.cities.create({
    data: {
      postal: 13001,
      name: "Marseille",
      x: 43,
      y: 5,
    },
  });

  // Créer des utilisateurs
  const user1 = await prisma.users.create({
    data: {
      email: "user1@example.com",
      password: crypto.createHash("sha256").update("password123").digest("hex"),
      role: 'USER',
      city: {
        connect: { id: city1.id },
      },
    },
  });

  const user2 = await prisma.users.create({
    data: {
      email: "user2@example.com",
      password: crypto.createHash("sha256").update("password456").digest("hex"),
      role: 'USER',
      city: {
        connect: { id: city2.id },
      },
    },
  });

  const user3 = await prisma.users.create({
    data: {
      email: "user3@example.com",
      password: crypto.createHash("sha256").update("pass").digest("hex"),
      role: 'DOCTOR',
      city: {
        connect: { id: city2.id },
      },
    },
  });

  // Créer des docteurs
  const doctor1 = await prisma.doctors.create({
    data: {
      user: {
        connect: { id: user1.id },
      },
      service: "Service 1", // Add the missing 'service' property
    },
  });

  const doctor2 = await prisma.doctors.create({
    data: {
      user: {
        connect: { id: user2.id },
      },
      service: "Service 2", // Add the missing 'service' property
    },
  });

  // Créer des réponses (Answer)
  const answer1 = await prisma.answers.create({
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

  const answer2 = await prisma.answers.create({
    data: {
      doctor: {
        connect: { id: doctor2.id },
      },
      start_date: new Date('2023-02-01T14:00:00Z'),
      end_date: new Date('2023-02-01T16:00:00Z'),
      seats: 15,
      patients: {
        connect: [{ id: user3.id }],
      },
    },
  });

  // Créer des requêtes (Request)
  const request1 = await prisma.requests.create({
    data: {
      answer: {
        connect: { id: answer1.id },
      },
      city: {
        connect: { id: city1.id },
      },
      service: "cardiologie",
      isAccepted: true,
      user: {
        connect: { id: user1.id }
      }
    },
  });

  const request2 = await prisma.requests.create({
    data: {
      answer: {
        connect: { id: answer2.id },
      },
      city: {
        connect: { id: city2.id },
      },
      service: "cardiologie",
      isAccepted: true,
      user: {
        connect: { id: user2.id }
      }
    },
  });

  prisma.$disconnect();
  console.log('Seeding terminé!');

  await prisma.$disconnect();
}
main();

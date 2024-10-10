import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Ajout des villes
  const carvin = await prisma.cities.create({
    data: {
      postal: 62220,
      name: 'Carvin',
      x: 50,
      y: 3,
    },
  });

  const lille = await prisma.cities.create({
    data: {
      postal: 59000,
      name: 'Lille',
      x: 50,
      y: 3,
    },
  });

  // Ajout des utilisateurs
  const daniel = await prisma.users.create({
    data: {
      email: 'daniel@gmail.com',
      password: 'password123',  // Mettez ici un vrai hash pour la sécurité
      role: 'DOCTOR',
      cityId: carvin.id,
      doctor: {
        create: {
          service: 'cardiology',
        },
      },
    },
  });

  const axel = await prisma.users.create({
    data: {
      email: 'axel@gmail.com',
      password: 'password123',
      role: 'USER',
      cityId: lille.id,
    },
  });

  const antoine = await prisma.users.create({
    data: {
      email: 'antoine@gmail.com',
      password: 'password123',
      role: 'ADMIN',
      cityId: lille.id,
    },
  });

  // Ajout de la requête
  await prisma.requests.create({
    data: {
      service: 'cardiology',
      isAccepted: false,
      cityId: carvin.id,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

require("dotenv").config();
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default class UsersService {
  async connection({ email }: { email: string }) {
    try {
      const user = await prisma.users.findUnique({
        where: {
          email: email,
        },
        include: {
          role: true,
        },
      });

      return { user };
    } catch (error: any) {
      throw new Error(`Error during connection: ${error.message}`);
    }
  }

  async findUserByEmail(email: string) {
    try {
      const user = await prisma.users.findUnique({
        where: {
          email: email,
        },
      });
      return user;
    } catch (error: any) {
      throw new Error(`Error finding user by email: ${error.message}`);
    }
  }

  async createUser(userData: {
    email: string;
    password: string;
    pseudo: string;
    ville: string;
    codePostal: number;
    roleId: number;
  }) {
    try {
      const newUser = await prisma.users.create({
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
    } catch (error: any) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  async getAll(){
    try{
        const users = await prisma.user.findMany();
        return users;
    }catch(error:any){
      throw new Error(`Error during connection: ${error.message}`);
    }
  }
}

module.exports = UsersService;

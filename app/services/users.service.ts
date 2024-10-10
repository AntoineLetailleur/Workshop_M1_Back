require("dotenv").config();
import { Role, cities, PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

export default class UsersService {
  async connection({ email }: { email: string }) {
    try {
      const user = await prisma.users.findUnique({
        where: {
          email: email,
        }
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

  async findUserById(idUser : number){
    try{
      const user = await prisma.users.findUnique({
        where : {
          id : idUser
        }
      });
      return user;
    }catch(error:any){
      throw new Error(`Error during connection: ${error.message}`);
    }
  }

  async updateCityById(idUser : number,  cityId : number){
    try{
      const updateUser = await prisma.users.update({
        where: {
          id: idUser, 
        },
        data: {
          cityId: cityId, 
        },
      });
      return updateUser;
    }catch(error:any){
      throw new Error(`Error during connection: ${error.message}`);
    }
  }

  async getUserInfos(id: number) {
    try {
      const user = await prisma.users.findUnique({
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
    } catch (error: any) {
      throw new Error(`Error finding user by email: ${error.message}`);
    }
  }

  async createUser(userData: {
    email: string;
    cityId: number;
    password: string;
    role: Role
  }) {
    try {
      const newUser = await prisma.users.create({
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
    } catch (error: any) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }
}

module.exports = UsersService;

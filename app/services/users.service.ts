require("dotenv").config();
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default class UsersService {
  async connection({ email }: { email: string }) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email: email,
        },
        include: {
          //role: true,
        },
      });

      return { user };
    } catch (error: any) {
      throw new Error(`Error during connection: ${error.message}`);
    }
  }

  async findUserByEmail(email: string) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });
      return user;
    } catch (error: any) {
      throw new Error(`Error finding user by email: ${error.message}`);
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

  async findUserById(idUser : number){
    try{
      const user = await prisma.user.findUnique({
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
      const updateUser = await prisma.user.update({
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
}

module.exports = UsersService;

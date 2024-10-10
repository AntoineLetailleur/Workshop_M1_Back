require("dotenv").config();
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

export default class CityService {
    async addNewCity(postal : number, name : string, x : number, y : number) {
        try{
            const city = await prisma.cities.create({
                data : {
                    postal : postal,
                    name : name,
                    x : x,
                    y : y
                }
            });
            return city;
        }catch(error:any){
            throw new Error(`Error during connection: ${error.message}`);
        }
    }

    async findByName(name : string){
        try{
            const city = await prisma.cities.findFirst({
                where : {
                    name : name
                }
              });
            return city;
        }catch(error:any){
            throw new Error(`Error during connection: ${error.message}`);
        }
    }
}

module.exports = CityService;

import { Request, Response } from 'express';
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const requestsController = {
    addNewRequest: async (req: Request, res: Response): Promise<any> => {
        try{
            const {userId, serviceType, cityId} = req.body;
                const userList = prisma.request.findMany({
                    where: {
                        serviceId: serviceType,
                        cityId: cityId
                    },
                    select: {
                        users: true
                    }
                })
            console.log("userList: ", userList)

            if (userList.length > 0) {
                // La liste des utilisateurs n'est pas vide
                console.log("Il y a des utilisateurs :", userList);
            } else {
                // La liste des utilisateurs est vide
                console.log("Aucun utilisateur trouvé.");
                const request = prisma.request.create({
                    data: {
                        serviceId : serviceType,
                        cityId : cityId,
                        users : userId
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
        }catch (error) {
            console.error(error);
        }
        
    }
}

export default requestsController
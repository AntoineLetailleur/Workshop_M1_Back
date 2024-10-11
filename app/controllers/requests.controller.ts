import { Request, Response } from 'express';
import UsersService from '../services/users.service';
import jwt, { JwtPayload } from "jsonwebtoken";


const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const userService = new UsersService();

const requestsController = {
    addNewRequest: async (req: Request, res: Response): Promise<any> => {
        try{
            
            const token = req.headers.authorization?.split("Bearer ")[1] ?? '';
            if (!token) {
                return res.sendStatus(401); 
            }

            const decodedToken = jwt.decode(token);

            if (!decodedToken) {
                return res.sendStatus(403); 
            }
            
            const userId = (decodedToken as JwtPayload).userId;
            const {serviceType} = req.body;
            const myUser = await userService.findUserById(userId)
            const cityId = myUser?.cityId
            const userList = await prisma.requests.findMany({
                where: {
                    service: serviceType,
                    cityId: cityId
                },
                select: {
                    user: {
                        select: { id: true }
                    }
                }
            })

            if (userList.length > 0) {
                var foundUser = false;
                for (const request of userList) {
                    for (const user of request.user) {
                        console.log("User ID:", user.id); 

                        if (user.id === userId) {
                            foundUser = true;
                        } 
                    }
                }
                if (foundUser) {
                    console.log("L'utilisateur a déjà exprimé cette demande !");
                    return res.status(500).send("Cette demande a déjà été envoyée...");
                } else {
                    console.log("L'utilisateur se joint à une demande déjà exprimée");
                
                    const updatedRequest = await prisma.requests.update({
                        where: {
                            service: serviceType,
                            cityId: cityId
                        },
                        data: {
                            user: {
                                connect: { id: userId }
                            }
                        }
                    });
                    console.log("Demande mise à jour avec succès :", updatedRequest);
                    return res.status(200).send("L'utilisateur a été ajouté à la demande.");
                }
            } else {
                console.log("L'utilisateur exprime une nouvelle requête");
                const request = await prisma.requests.create({
                    data: {
                        service: serviceType,
                        cityId: cityId,
                        user: {
                            connect: { id: userId }
                        },
                        isAccepted: false
                    }
                });
                console.log(request);
                return res.status(200).send(request);
            }
        } catch (error) {
            console.error(error);        
        }  
    }
}

export default requestsController
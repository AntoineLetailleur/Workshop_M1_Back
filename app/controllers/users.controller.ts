import UsersService from "../services/users.service";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { Response, Request } from "express";
import { tokenSecret } from "../src";
import { formatJsonApiError } from "../serializers/error.serializer";
import CityService from "../services/citys.service";
import axios from "axios";
import { cities, Prisma, PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

const usersController = {
  validateRequest: (requiredRole: string[]) => {
    return (req: Request, res: Response, next: Function) : void => {
      const { authorization } = req.headers;

      if (!authorization) {
        const formattedError = formatJsonApiError([
          {
            status: "401",
            title: "Unauthorized",
            detail:
              "Vous n'avez pas les droits suffisant pour acceder à cette ressource.",
          },
        ]);
        res.set("Content-Type", "application/vnd.api+json");
        res.status(401).json(formattedError);
        return;
      }

      const token = authorization.split("Bearer ")[1];

      try {
        const decodedToken = jwt.verify(token, tokenSecret) as jwt.JwtPayload;

        if (
          decodedToken &&
          decodedToken.iss === "http://localhost:3000/users" &&
          typeof decodedToken.exp !== "undefined" &&
          decodedToken.exp < Date.now() &&
          requiredRole.includes(decodedToken.role)
        ) {
          req.userId = decodedToken.userId;
          next();
          return;
        } else {
          const formattedError = formatJsonApiError([
            {
              status: "403",
              title: "Forbidden",
              detail: "Vous n'êtes pas autorisé à effectuer cette action.",
            },
          ]);
          res.set("Content-Type", "application/vnd.api+json");
          res.status(403).json(formattedError);
          return;
        }
      } catch (error) {
        console.log(error);
        const formattedError = formatJsonApiError([
          {
            status: "500",
            title: "Internal server error",
            detail: error,
          },
        ]);
        res.set("Content-Type", "application/vnd.api+json"); 
        res.status(500).json(formattedError);
        return;
      }
    };
  },

  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      req.body.password = crypto
        .createHash("sha256")
        .update(password)
        .digest("hex");
      const usersService = new UsersService();
      const { user }: { user: any } = await usersService.connection({ email });

      if (
        !user ||
        user.email !== req.body.email ||
        user.password !== req.body.password
      ) {
        const formattedError = formatJsonApiError([
          {
            status: "400",
            title: "Bad request",
            detail: "Adresse email ou mot de passe invalide.",
          },
        ]);
        res.set("Content-Type", "application/vnd.api+json");
        res.status(400).json(formattedError);
        return;
      }

      const token = jwt.sign(
        {
          userId: user.id,
          role: user.role,
        },
        tokenSecret,
        {
          algorithm: "HS256",
          expiresIn: "24h",
          issuer: "http://localhost:3000/users",
          subject: user.id.toString(),
        }
      );

      res.json({ token });
    } catch (error) {
      console.error(error);
      const formattedError = formatJsonApiError([
        {
          status: "500",
          title: "Internal Server Error",
          detail: error,
        },
      ]);
      res.set("Content-Type", "application/vnd.api+json");
      res.status(500).json(formattedError);
      return;
    }
  },

  updateCity : async (req : Request, res : Response) => {
    try{
      const userService = new UsersService();
      const cityService = new CityService();
      const {idUser, name, postal, x, y} = req.body;

      //Récupération de l'utilisateur
      const user = await userService.findUserById(idUser);
      if(!user){
        res.status(500).json("No user");
        return;
      }

      var city = await cityService.findByName(name);
      if(!city){
        city = await cityService.addNewCity(postal,name,x,y);
      }
      const updateUser = await userService.updateCityById(user.id,city.id);
      res.status(200).send(updateUser);
    }catch (error) {
      res.status(500).json(error);
      return;
    }
  },

  getUserInfos : async (req: Request, res: Response) => {

    try {
      const userId = req.userId as number;
      const usersService = new UsersService();
      var data = await usersService.getUserInfos(userId);

      if (data) {
        res.set('Content-Type', 'application/vnd.api+json');
        res.status(200).send(data);
      }
    } catch (error) {
      console.error(error);
      const formattedError = formatJsonApiError([
        {
          status: '500',
          title: 'Internal Server Error',
          detail: error,
        },
      ]);
      res.set('Content-Type', 'application/vnd.api+json');
      res.status(500).json(formattedError);
      return;
    }
  },

  createUser : async (req: Request, res: Response) => {

    try {
      const { email, password, city } = req.body;
      const usersService = new UsersService();

      const existingUser = await usersService.findUserByEmail(email);
      if (existingUser) {
        const formattedError = formatJsonApiError([
          {
            status: '400',
            title: 'Bad request',
            detail: 'l\'email existe déjà.',
          },
        ]);
        res.set('Content-Type', 'application/vnd.api+json');
        res.status(400).json(formattedError);
        return;
      }

      const { data } = await axios.get(`https://api-adresse.data.gouv.fr/search/?q=${city}`);
      
      if (!data || !data.features || data.features.length === 0) {
        const formattedError = formatJsonApiError([
          {
            status: "400",
            title: "City not found",
            detail: "La ville n'a pas été trouvée dans l'API.",
          },
        ]);
        res.status(400).json(formattedError);
        return;
      }

      const cityFeature = data.features[0];
      const { postcode, city: name } = cityFeature.properties;
      const [longitude, latitude] = cityFeature.geometry.coordinates;
      console.log(latitude, longitude);

      let existingCity = await prisma.cities.findFirst({
        where: { postal: parseInt(postcode) },
      });

      if (!existingCity) {
        existingCity = await prisma.cities.create({
          data: {
            postal: parseInt(postcode),
            name: name,
            x: latitude,
            y: longitude,
          },
        });
      }

      const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

      var data_ = await usersService.createUser({
        email,
        cityId: existingCity.id,
        password: hashedPassword,
        role: 'USER'
      });

      res.set('Content-Type', 'application/vnd.api+json');
      res.status(200).send(data_);
    } catch (error) {
      console.error(error);
      const formattedError = formatJsonApiError([
        {
          status: '500',
          title: 'Internal Server Error',
          detail: error,
        },
      ]);
      res.set('Content-Type', 'application/vnd.api+json');
      res.status(500).json(formattedError);
      return;
    }
  },
};

export default usersController;

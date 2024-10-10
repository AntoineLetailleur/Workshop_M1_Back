import UsersService from "../services/users.service";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { Response, Request } from "express";
import { tokenSecret } from "../src";
import { formatJsonApiError } from "../serializers/error.serializer";
import CityService from "../services/citys.service";

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

  updateCity : async (req : Request, res : Response) : Promise<any> => {
    try{
      const userService = new UsersService();
      const cityService = new CityService();
      const {idUser, name, postal, x, y} = req.body;

      //Récupération de l'utilisateur
      const user = await userService.findUserById(idUser);
      if(!user){
        return res.status(500).json("No user");
      }

      //Si un utilisateur existe alors on update sa ville
      //Il faut checker que la nouvelle ville de l'utilisateur existe
      var city = await cityService.findByName(name);
      if(!city){
        //On ajout un nouvelle utilisateur dans la city déjà existante et on update le cityId au niveau du user
        city = await cityService.addNewCity(postal,name,x,y);
      }
      const updateUser = await userService.updateCityById(user.id,city.id);
      res.status(200).send(updateUser);
    }catch (error) {
      return res.status(500).json(error);
    }
  }
};

export default usersController;

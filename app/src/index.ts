import express from "express";
import bodyParser from "body-parser";
import crypto from "crypto";
import { Request, Response } from "express";
import { createServer } from "http";
import { config } from "dotenv";
import path from "path";
import userRouter from "../routers/users.router";
import cityRouter from "../routers/citys.router";
import "../interfaces/requests.interface";
import requestsRouter from "../routers/requests.router";
import YAML from "yamljs";
import swaggerUi from "swagger-ui-express";

const cors = require('cors');


////    Config serveur HTTP    \\\\
const app = express();
// Autorise toutes les origines
app.use(cors());
// Autorise une origine spécifique
app.use(cors({
  origin: '*'
}));

const server = createServer(app);
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server http is running at : http://localhost:${port}`);
});
app.use(bodyParser.json());
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.get("/", (_req: Request, res: Response) => {
  res.json({ Message: "Bienvenue sur l'API de SanteConnect" });
});
app.use("/", userRouter);
app.use("/", cityRouter);
app.use("/", requestsRouter);

////    Utilitaires    \\\\
const swaggerDocumentPath = path.join(__dirname, "../../swagger.yml");
const swaggerDocument = YAML.load(swaggerDocumentPath);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
export const tokenSecret = crypto.randomBytes(64).toString("hex");
console.log("Le tokenSecret a été mis à jour avec succès.");
config({ path: path.resolve(__dirname, "../app/.env") });
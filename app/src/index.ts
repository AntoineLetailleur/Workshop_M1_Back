import express from "express";
import bodyParser from "body-parser";
import crypto from "crypto";
import { Request, Response } from "express";
import { createServer } from "http";
import { config } from "dotenv";
import path from "path";
import userRouter from "../routers/users.router";
import cityRouter from "../routers/citys.router";

import YAML from "yamljs";
import swaggerUi from "swagger-ui-express";


////    Config serveur HTTP    \\\\
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
const app = express();
app.use(bodyParser.json());
const server = createServer(app);
const port = process.env.PORT || 3000;
app.use(express.urlencoded({ limit: "50mb", extended: true }));
server.listen(port, () => {
  console.log(`Server http is running at : http://localhost:${port}`);
});
app.get("/", (_req: Request, res: Response) => {
  res.json({ Message: "Bienvenue sur l'API de SanteConnect" });
});
app.use("/", userRouter);
app.use("/", cityRouter);

////    Utilitaires    \\\\
// const swaggerDocumentPath = path.join(__dirname, "../../app/openAPISpec.yml");
// const swaggerDocument = YAML.load(swaggerDocumentPath);
export const tokenSecret = crypto.randomBytes(64).toString("hex");
console.log("Le tokenSecret a été mis à jour avec succès.");
config({ path: path.resolve(__dirname, "../app/.env") });
import express from "express";
import bodyParser from "body-parser";
import crypto from "crypto";
import swaggerUi from "swagger-ui-express";
import { Request, Response } from "express";
import { createServer } from "http";
import { config } from "dotenv";
import path from "path";
<<<<<<< HEAD
import YAML from "yamljs";
=======
import userRoutes from '../routes/Users.routes'; 
>>>>>>> 36501c9fb42687c4ee2694ece929ddad1b856aea

////    Utilitaires    \\\\
// const swaggerDocumentPath = path.join(__dirname, "../../app/openAPISpec.yml");
// const swaggerDocument = YAML.load(swaggerDocumentPath);
export const tokenSecret = crypto.randomBytes(64).toString("hex");
console.log("Le tokenSecret a été mis à jour avec succès.");
config({ path: path.resolve(__dirname, "../app/.env") });

////    Config serveur HTTP    \\\\
const app = express();
const server = createServer(app);
const port = process.env.PORT || 3000;
app.use(express.urlencoded({ limit: "50mb", extended: true }));

server.listen(port, () => {
  console.log(`Server http is running at : http://localhost:${port}`);
});
app.get("/", (_req: Request, res: Response) => {
  res.json({ Message: "Bienvenue sur l'API de SanteConnect" });
});
app.use(bodyParser.json());
<<<<<<< HEAD
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/", require("../routers/users.router"));
=======
app.use("/", userRoutes);

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// app.use("/", require("../routes/Annonce.routes"));
// app.use("/", require("../routes/Fiche.routes"));
// app.use("/", require("../routes/Photo.routes"));
>>>>>>> 36501c9fb42687c4ee2694ece929ddad1b856aea

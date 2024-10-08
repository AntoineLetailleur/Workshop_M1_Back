import express from "express";
import bodyParser from "body-parser";
import crypto from "crypto";
import { Request, Response } from "express";
import { createServer } from "http";
import { config } from "dotenv";
import path from "path";

////    Utilitaires    \\\\
//export const tokenSecret = crypto.randomBytes(64).toString("hex");
//console.log("Le tokenSecret a été mis à jour avec succès.");
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
  res.json({ Message: "Bienvenue sur l'API Arosaje de notre groupe !" });
});
app.use(bodyParser.json());
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// app.use("/", require("../routes/Users.routes"));
// app.use("/", require("../routes/Annonce.routes"));
// app.use("/", require("../routes/Fiche.routes"));
// app.use("/", require("../routes/Photo.routes"));

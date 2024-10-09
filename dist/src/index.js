"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenSecret = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const crypto_1 = __importDefault(require("crypto"));
const http_1 = require("http");
const dotenv_1 = require("dotenv");
const path_1 = __importDefault(require("path"));
////    Utilitaires    \\\\
// const swaggerDocumentPath = path.join(__dirname, "../../app/openAPISpec.yml");
// const swaggerDocument = YAML.load(swaggerDocumentPath);
exports.tokenSecret = crypto_1.default.randomBytes(64).toString("hex");
console.log("Le tokenSecret a été mis à jour avec succès.");
(0, dotenv_1.config)({ path: path_1.default.resolve(__dirname, "../app/.env") });
////    Config serveur HTTP    \\\\
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const port = process.env.PORT || 3000;
app.use(express_1.default.urlencoded({ limit: "50mb", extended: true }));
server.listen(port, () => {
    console.log(`Server http is running at : http://localhost:${port}`);
});
app.get("/", (_req, res) => {
    res.json({ Message: "Bienvenue sur l'API Arosaje de notre groupe !" });
});
app.use(body_parser_1.default.json());
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/", require("../routers/users.router"));

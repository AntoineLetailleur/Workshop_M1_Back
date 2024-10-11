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
const users_router_1 = __importDefault(require("../routers/users.router"));
const citys_router_1 = __importDefault(require("../routers/citys.router"));
require("../interfaces/requests.interface");
const requests_router_1 = __importDefault(require("../routers/requests.router"));
const yamljs_1 = __importDefault(require("yamljs"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const cors = require('cors');
////    Config serveur HTTP    \\\\
const app = (0, express_1.default)();
// Autorise toutes les origines
app.use(cors());
// Autorise une origine spécifique
app.use(cors({
    origin: '*'
}));
const server = (0, http_1.createServer)(app);
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server http is running at : http://localhost:${port}`);
});
app.use(body_parser_1.default.json());
app.use(express_1.default.urlencoded({ limit: "50mb", extended: true }));
app.get("/", (_req, res) => {
    res.json({ Message: "Bienvenue sur l'API de SanteConnect" });
});
app.use("/", users_router_1.default);
app.use("/", citys_router_1.default);
app.use("/", requests_router_1.default);
////    Utilitaires    \\\\
const swaggerDocumentPath = path_1.default.join(__dirname, "../../swagger.yml");
const swaggerDocument = yamljs_1.default.load(swaggerDocumentPath);
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
exports.tokenSecret = crypto_1.default.randomBytes(64).toString("hex");
console.log("Le tokenSecret a été mis à jour avec succès.");
(0, dotenv_1.config)({ path: path_1.default.resolve(__dirname, "../app/.env") });

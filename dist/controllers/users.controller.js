"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_service_1 = __importDefault(require("../services/users.service"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const src_1 = require("../src");
const error_serializer_1 = require("../serializers/error.serializer");
const usersController = {
    validateRequest: (requiredRole) => {
        return (req, res, next) => {
            const { authorization } = req.headers;
            if (!authorization) {
                const formattedError = (0, error_serializer_1.formatJsonApiError)([
                    {
                        status: "401",
                        title: "Unauthorized",
                        detail: "Vous n'avez pas les droits suffisant pour acceder à cette ressource.",
                    },
                ]);
                res.set("Content-Type", "application/vnd.api+json");
                return res.status(401).json(formattedError);
            }
            const token = authorization.split("Bearer ")[1];
            try {
                const decodedToken = jsonwebtoken_1.default.verify(token, src_1.tokenSecret);
                if (decodedToken &&
                    decodedToken.iss === "http://localhost:3000/users" &&
                    typeof decodedToken.exp !== "undefined" &&
                    decodedToken.exp < Date.now() &&
                    requiredRole.includes(decodedToken.role)) {
                    req.userId = decodedToken.userId;
                    next();
                    return;
                }
                else {
                    const formattedError = (0, error_serializer_1.formatJsonApiError)([
                        {
                            status: "403",
                            title: "Forbidden",
                            detail: "Vous n'êtes pas autorisé à effectuer cette action.",
                        },
                    ]);
                    res.set("Content-Type", "application/vnd.api+json");
                    return res.status(403).json(formattedError);
                }
            }
            catch (error) {
                console.log(error);
                const formattedError = (0, error_serializer_1.formatJsonApiError)([
                    {
                        status: "500",
                        title: "Internal server error",
                        detail: error,
                    },
                ]);
                res.set("Content-Type", "application/vnd.api+json");
                return res.status(500).json(formattedError);
            }
        };
    },
    login: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            req.body.password = crypto_1.default
                .createHash("sha256")
                .update(password)
                .digest("hex");
            const usersService = new users_service_1.default();
            const { user } = yield usersService.connection({ email });
            if (!user ||
                user.email !== req.body.email ||
                user.password !== req.body.password) {
                const formattedError = (0, error_serializer_1.formatJsonApiError)([
                    {
                        status: "400",
                        title: "Bad request",
                        detail: "Adresse email ou mot de passe invalide.",
                    },
                ]);
                res.set("Content-Type", "application/vnd.api+json");
                res.status(400).json(formattedError);
            }
            const token = jsonwebtoken_1.default.sign({
                userId: user.id,
                role: user.role.libelle,
            }, src_1.tokenSecret, {
                algorithm: "HS256",
                expiresIn: "24h",
                issuer: "http://localhost:3000/users",
                subject: user.id.toString(),
            });
            res.json({ token });
        }
        catch (error) {
            console.error(error);
            const formattedError = (0, error_serializer_1.formatJsonApiError)([
                {
                    status: "500",
                    title: "Internal Server Error",
                    detail: error,
                },
            ]);
            res.set("Content-Type", "application/vnd.api+json");
            res.status(500).json(formattedError);
        }
    }),
    getAll: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userService = new users_service_1.default();
            var data = yield userService.getAll();
            if (data) {
                return res.status(200).json(data);
            }
        }
        catch (error) {
            return res.status(500).json(error);
        }
    }),
};
exports.default = usersController;

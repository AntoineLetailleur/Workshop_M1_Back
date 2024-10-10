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
const error_serializer_1 = require("../serializers/error.serializer");
const citys_service_1 = __importDefault(require("../services/citys.service"));
const cityController = {
    addNewCity: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { postal, name, x, y } = req.body;
            const cityService = new citys_service_1.default();
            const city = yield cityService.addNewCity(postal, name, x, y);
            return res.status(200).send(city);
        }
        catch (error) {
            const formattedError = (0, error_serializer_1.formatJsonApiError)([
                {
                    status: '500',
                    title: 'Internal Server Error',
                    detail: error,
                },
            ]);
            res.set('Content-Type', 'application/vnd.api+json');
            return res.status(500).json(formattedError);
        }
    })
};
exports.default = cityController;

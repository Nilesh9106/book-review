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
exports.authMiddleware = void 0;
const dotenv_1 = require("dotenv");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
(0, dotenv_1.config)();
const authMiddleware = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (request.headers &&
            request.headers["authorization"] &&
            request.headers["authorization"].split(" ").at(1)) {
            const decodedToken = (jsonwebtoken_1.default.verify(request.headers["authorization"].split(" ")[1], process.env.JWT_SECRET));
            request.user = {
                _id: decodedToken._id,
                username: decodedToken.username,
                email: decodedToken.email,
            };
            next();
        }
        else {
            response.status(401).json({
                message: "you are not authorized",
            });
        }
    }
    catch (error) {
        response.status(401).json({
            message: "you are not authorized!",
        });
    }
});
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=authMiddleware.js.map
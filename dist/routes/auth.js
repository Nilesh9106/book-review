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
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("../models/user"));
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const AuthRouter = express_1.default.Router();
AuthRouter.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield user_1.default.findOne({ email });
    if (user) {
        if (yield (0, bcrypt_1.compare)(password, user.password)) {
            const token = jsonwebtoken_1.default.sign({
                _id: user._id,
                username: user.username,
                email: user.email,
            }, process.env.JWT_SECRET, { expiresIn: "30d" });
            return res.status(200).json({
                message: "Login Success",
                user: {
                    username: user.username,
                    id: user._id,
                    email: user.email,
                },
                token,
            });
        }
        else {
            return res.status(400).json({ message: "Incorrect Password" });
        }
    }
    else {
        return res.status(400).json({ message: "User Not found" });
    }
}));
AuthRouter.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password, } = req.body;
    let user = yield user_1.default.findOne({ email });
    if (user) {
        return res.status(400).json({ message: "email already exists" });
    }
    user = yield user_1.default.findOne({ username });
    if (user) {
        return res.status(400).json({ message: "Username already exists" });
    }
    const newUser = yield user_1.default.create({ username, email, password });
    if (newUser) {
        const token = jsonwebtoken_1.default.sign({
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
        }, process.env.JWT_SECRET, { expiresIn: "30d" });
        return res.status(200).json({
            message: "User created",
            user: {
                username: newUser.username,
                id: newUser._id,
                email: newUser.email,
            },
            token,
        });
    }
    else {
        return res.status(400).json({ message: "User not created" });
    }
}));
exports.default = AuthRouter;
//# sourceMappingURL=auth.js.map
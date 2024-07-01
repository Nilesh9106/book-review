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
const book_1 = __importDefault(require("../models/book"));
const bookRouter = express_1.default.Router();
bookRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page || "0");
    const size = parseInt(req.query.size || "10");
    let sortBy = req.query.sortBy;
    if (!["id", "title"].includes(sortBy)) {
        sortBy = "id";
    }
    const reviews = yield book_1.default.find()
        .skip(page * size)
        .limit(size)
        .sort({ [sortBy]: -1 });
    return res.status(200).json({ reviews });
}));
bookRouter.get("/search", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query.query;
    const page = parseInt(req.query.page || "0");
    const size = parseInt(req.query.size || "10");
    const books = yield book_1.default.find({ title: { $regex: query, $options: "i" } })
        .skip(page * size)
        .limit(size);
    return res.status(200).json({ books });
}));
exports.default = bookRouter;
//# sourceMappingURL=book.js.map
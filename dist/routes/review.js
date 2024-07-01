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
const review_1 = __importDefault(require("../models/review"));
const book_1 = __importDefault(require("../models/book"));
const reviewRouter = express_1.default.Router();
reviewRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { book_id, rating, comment } = req.body;
    const book = yield book_1.default.findOne({ book_id });
    if (!book) {
        return res.status(404).json({ message: "book not found" });
    }
    const review = yield review_1.default.create({
        book_id,
        rating,
        comment,
        user_id: req.user._id,
    });
    if (review) {
        return res.status(201).json({ message: "review created", review });
    }
    else {
        return res.status(400).json({ message: "review not created" });
    }
}));
reviewRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page || "0");
    const size = parseInt(req.query.size || "10");
    const reviews = yield review_1.default.find()
        .skip(page * size)
        .limit(size);
    return res.status(200).json({ reviews });
}));
reviewRouter.get("/GetByLoggedInUser", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page || "0");
    const size = parseInt(req.query.size || "10");
    const reviews = yield review_1.default.find({ user_id: req.user._id })
        .skip(page * size)
        .limit(size);
    return res.status(200).json({ reviews });
}));
reviewRouter.get("/GetByBookId/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page || "0");
    const size = parseInt(req.query.size || "10");
    const bookId = req.params.bookId;
    const reviews = yield review_1.default.find({ book_id: bookId })
        .skip(page * size)
        .limit(size);
    return res.status(200).json({ reviews });
}));
reviewRouter.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const review = yield review_1.default.findById(id);
    if (review) {
        return res.status(200).json({ review });
    }
    else {
        return res.status(404).json({ message: "review not found" });
    }
}));
reviewRouter.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { rating, comment } = req.body;
    const id = req.params.id;
    const review = yield review_1.default.findByIdAndUpdate(id, { rating, comment }, { new: true });
    if (review) {
        return res.status(200).json({ message: "review updated", review });
    }
    else {
        return res.status(400).json({ message: "review not updated" });
    }
}));
reviewRouter.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const review = yield review_1.default.findByIdAndDelete(id);
    if (review) {
        return res.status(200).json({ message: "review deleted" });
    }
    else {
        return res.status(400).json({ message: "review not deleted" });
    }
}));
exports.default = reviewRouter;
//# sourceMappingURL=review.js.map
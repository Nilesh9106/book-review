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
const cors_1 = __importDefault(require("cors"));
const cheerio_1 = require("cheerio");
const auth_1 = __importDefault(require("./routes/auth"));
const dotenv_1 = require("dotenv");
const mongoose_1 = __importDefault(require("mongoose"));
const authMiddleware_1 = require("./middleware/authMiddleware");
const review_1 = __importDefault(require("./routes/review"));
const book_1 = __importDefault(require("./routes/book"));
const book_2 = __importDefault(require("./models/book"));
(0, dotenv_1.config)();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/auth", auth_1.default);
app.use("api/review", authMiddleware_1.authMiddleware, review_1.default);
app.use("api/books", authMiddleware_1.authMiddleware, book_1.default);
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.get("/fetch-books", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const link = "https://openlibrary.org/trending/daily";
    let i = 0;
    while (i < 10) {
        const books = [];
        const response = yield fetch(`${link}${i != 0 ? `?page=${i}` : ""}`, {
            redirect: "follow",
        });
        const html = yield response.text();
        const $ = (0, cheerio_1.load)(html);
        $("ul.list-books .searchResultItem").each((index, element) => {
            var _a, _b;
            const book = $(element);
            const title = book.find(".booktitle").text().trim();
            const id = (_b = (_a = book
                .find(".bookcover a")
                .attr("href")) === null || _a === void 0 ? void 0 : _a.split("/").pop()) === null || _b === void 0 ? void 0 : _b.split("?")[0];
            const author = [];
            book.find(".bookauthor a").each((index, element) => {
                author.push($(element).text());
            });
            const cover = book.find(".bookcover img").attr("src");
            books.push({
                book_id: id !== null && id !== void 0 ? id : "",
                author: author,
                cover: cover !== null && cover !== void 0 ? cover : "",
                title: title,
            });
        });
        for (let i = 0; i < books.length; i++) {
            const element = books[i];
            const book = yield book_2.default.findOne({ book_id: element.book_id });
            if (!book) {
                console.log("Creating book", element.book_id);
                yield book_2.default.create({
                    book_id: element.book_id,
                    title: element.title,
                    author: element.author,
                    cover: element.cover,
                });
            }
            else {
                console.log("Updating book", element.book_id);
                yield book_2.default.updateOne({ book_id: element.book_id }, Object.assign({}, element));
            }
        }
        i++;
    }
    res.json({ message: "Books Fetched  Successfully" });
}));
const dbURL = process.env.MONGODB_URI;
if (dbURL) {
    mongoose_1.default
        .connect(dbURL)
        .then(() => {
        console.log("DB Connected");
    })
        .catch((err) => {
        console.log(err);
    });
}
else {
    console.log("DB URL not found");
}
app.listen(process.env.PORT || 3000, () => {
    console.log("listening on port http://localhost:3000");
});
//# sourceMappingURL=index.js.map
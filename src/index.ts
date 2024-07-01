import express from "express";
import cors from "cors";
import { load } from "cheerio";
import { BookType } from "./types/book";
import AuthRouter from "./routes/auth";
import { config } from "dotenv";
import mongoose from "mongoose";
import { authMiddleware } from "./middleware/authMiddleware";
import reviewRouter from "./routes/review";
import { UserType } from "./types/user";
import bookRouter from "./routes/book";
import Book from "./models/book";

config();

const app = express();

declare module "express-serve-static-core" {
  interface Request {
    user: UserType;
  }
}

app.use(cors());
app.use(express.json());

app.use("/api/auth", AuthRouter);
app.use("api/review", authMiddleware, reviewRouter);
app.use("api/books", authMiddleware, bookRouter);

app.get("/fetch-books", async (req, res) => {
  const link = "https://openlibrary.org/trending/daily";
  let i = 0;
  while (i < 10) {
    const books: BookType[] = [];
    const response = await fetch(`${link}${i != 0 ? `?page=${i}` : ""}`, {
      redirect: "follow",
    });
    const html = await response.text();
    const $ = load(html);
    $("ul.list-books .searchResultItem").each((index, element) => {
      const book = $(element);
      const title = book.find(".booktitle").text().trim();
      const id = book
        .find(".bookcover a")
        .attr("href")
        ?.split("/")
        .pop()
        ?.split("?")[0];
      const author: string[] = [];
      book.find(".bookauthor a").each((index, element) => {
        author.push($(element).text());
      });
      const cover = book.find(".bookcover img").attr("src");
      books.push({
        book_id: id ?? "",
        author: author,
        cover: cover ?? "",
        title: title,
      });
    });
    for (let i = 0; i < books.length; i++) {
      const element = books[i];
      const book = await Book.findOne({ book_id: element.book_id });
      if (!book) {
        console.log("Creating book", element.book_id);
        await Book.create({
          book_id: element.book_id,
          title: element.title,
          author: element.author,
          cover: element.cover,
        });
      } else {
        console.log("Updating book", element.book_id);
        await Book.updateOne({ book_id: element.book_id }, { ...element });
      }
    }
    i++;
  }
  res.json({ message: "Books Fetched  Successfully" });
});

const dbURL = process.env.MONGODB_URI;
if (dbURL) {
  mongoose
    .connect(dbURL)
    .then(() => {
      console.log("DB Connected");
    })
    .catch((err) => {
      console.log(err);
    });
} else {
  console.log("DB URL not found");
}

app.listen(process.env.PORT || 3000, () => {
  console.log("listening on port http://localhost:3000");
});

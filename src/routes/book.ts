import express from "express";
import Book from "../models/book";

const bookRouter = express.Router();

bookRouter.get("/", async (req, res) => {
  const page = parseInt((req.query.page as string) || "0");
  const size = parseInt((req.query.size as string) || "10");
  let sortBy: string | null = req.query.sortBy as string;
  if (!["id", "title"].includes(sortBy)) {
    sortBy = "id";
  }
  const reviews = await Book.find()
    .skip(page * size)
    .limit(size)
    .sort({ [sortBy]: -1 });
  return res.status(200).json({ reviews });
});

bookRouter.get("/search", async (req, res) => {
  const query = req.query.query as string;
  const page = parseInt((req.query.page as string) || "0");
  const size = parseInt((req.query.size as string) || "10");
  const books = await Book.find({ title: { $regex: query, $options: "i" } })
    .skip(page * size)
    .limit(size);
  return res.status(200).json({ books });
});

export default bookRouter;

import express from "express";
import Book from "../models/book";

const bookRouter = express.Router();

bookRouter.get("/", async (req, res) => {
  const page = parseInt((req.query.page as string) || "0");
  const size = parseInt((req.query.size as string) || "10");
  const reviews = await Book.find()
    .skip(page * size)
    .limit(size);
  return res.status(200).json({ reviews });
});

export default bookRouter;

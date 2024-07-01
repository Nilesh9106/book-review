import express from "express";
import Review from "../models/review";
import Book from "../models/book";

const reviewRouter = express.Router();

reviewRouter.post("/", async (req, res) => {
  const { book_id, rating, comment } = req.body;
  const book = await Book.findOne({ book_id });
  if (!book) {
    return res.status(404).json({ message: "book not found" });
  }
  const review = await Review.create({
    book_id,
    rating,
    comment,
    user_id: req.user._id,
  });
  if (review) {
    return res.status(201).json({ message: "review created", review });
  } else {
    return res.status(400).json({ message: "review not created" });
  }
});

reviewRouter.get("/", async (req, res) => {
  const page = parseInt((req.query.page as string) || "0");
  const size = parseInt((req.query.size as string) || "10");
  const reviews = await Review.find()
    .skip(page * size)
    .limit(size);
  return res.status(200).json({ reviews });
});
reviewRouter.get("/GetByLoggedInUser", async (req, res) => {
  const page = parseInt((req.query.page as string) || "0");
  const size = parseInt((req.query.size as string) || "10");
  const reviews = await Review.find({ user_id: req.user._id })
    .skip(page * size)
    .limit(size);
  return res.status(200).json({ reviews });
});
reviewRouter.get("/GetByBookId/:bookId", async (req, res) => {
  const page = parseInt((req.query.page as string) || "0");
  const size = parseInt((req.query.size as string) || "10");
  const bookId = req.params.bookId;
  const reviews = await Review.find({ book_id: bookId })
    .skip(page * size)
    .limit(size);
  return res.status(200).json({ reviews });
});

reviewRouter.get("/:id", async (req, res) => {
  const id = req.params.id;

  const review = await Review.findById(id);
  if (review) {
    return res.status(200).json({ review });
  } else {
    return res.status(404).json({ message: "review not found" });
  }
});

reviewRouter.put("/:id", async (req, res) => {
  const { rating, comment } = req.body;
  const id = req.params.id;
  const review = await Review.findByIdAndUpdate(
    id,
    { rating, comment },
    { new: true }
  );
  if (review) {
    return res.status(200).json({ message: "review updated", review });
  } else {
    return res.status(400).json({ message: "review not updated" });
  }
});

reviewRouter.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const review = await Review.findByIdAndDelete(id);
  if (review) {
    return res.status(200).json({ message: "review deleted" });
  } else {
    return res.status(400).json({ message: "review not deleted" });
  }
});

export default reviewRouter;

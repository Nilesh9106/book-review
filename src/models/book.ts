import mongoose, { Document, Schema } from "mongoose";

// Define interface for User document
interface BookDoc extends Document {
  book_id: string;
  title: string;
  cover: string;
  author: string[];
}

// Define schema for Users collection
const bookSchema = new Schema<BookDoc>({
  book_id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  cover: { type: String, required: true },
  author: [{ type: String, required: true }],
});

// Create model for User schema
const Book: mongoose.Model<BookDoc> =
  mongoose.models.Book || mongoose.model<BookDoc>("Book", bookSchema);

// Export User model
export default Book;

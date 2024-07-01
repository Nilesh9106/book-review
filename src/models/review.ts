import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";

// Define interface for User document
interface ReviewDoc extends Document {
  book_id: string;
  rating: number;
  comment: string;
}

// Define schema for Users collection
const reviewSchema = new Schema<ReviewDoc>({
  book_id: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: false },
});

// Create model for User schema
const Review: mongoose.Model<ReviewDoc> =
  mongoose.models.Review || mongoose.model<ReviewDoc>("Review", reviewSchema);

// Export User model
export default Review;

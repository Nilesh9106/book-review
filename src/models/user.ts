import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";

// Define interface for User document
interface UserDoc extends Document {
  username: string;
  email: string;
  password: string;
}

// Define schema for Users collection
const userSchema = new Schema<UserDoc>({
  username: { type: String, unique: true, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Create model for User schema
const User: mongoose.Model<UserDoc> =
  mongoose.models.User || mongoose.model<UserDoc>("User", userSchema);

// Export User model
export default User;

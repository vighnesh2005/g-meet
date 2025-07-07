import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      default: "", // fallback if OAuth name is missing
    },
    lastName: {
      type: String,
      default: "", // fallback if OAuth name is missing
    },
    image: {
      type: String,
      default: "",
    },
    authProvider: {
      type: String,
      enum: ["email", "google", "github"],
      default: "email",
    },
    color: {
      type: String,
      default: "#000000", // default color if not set
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);

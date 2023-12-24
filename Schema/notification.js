import mongoose from "mongoose";
import { ObjectId } from "bson";

const notificationSchema = new mongoose.Schema({
  notificationName: {
    type: String,
    trim: true,
    required: true,
    minLength: [2, "Name should have at least 2 characters"],
    maxLength: [25, "Name should have at most 30 characters"],
  },
  message: {
    type: String,
    required: true,
    trim: true,
    minLength: [8, "Name should have at least 2 characters"],
    maxLength: [50, "Name should have at most 30 characters"],
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  createdBy: {
    type: ObjectId,
    trim: true,
  },
});

export const Notification = mongoose.model("Notification", notificationSchema);

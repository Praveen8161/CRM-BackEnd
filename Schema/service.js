import mongoose from "mongoose";
import { ObjectId } from "bson";

const serviceSchema = new mongoose.Schema({
  serviceName: {
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
    ref: "Admin",
    trim: true,
  },
  currentUser: [
    {
      type: ObjectId,
      ref: "User",
      trim: true,
    },
  ],
  oldUser: [
    {
      type: ObjectId,
      ref: "User",
      trim: true,
    },
  ],
});

export const Service = mongoose.model("Service", serviceSchema);

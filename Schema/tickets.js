import mongoose from "mongoose";
import { ObjectId } from "bson";
import ShortUniqueId from "short-unique-id";

// random String Generator
const randomStr = new ShortUniqueId();

const ticketSchema = new mongoose.Schema({
  ticketName: {
    type: String,
    required: true,
    trim: true,
    minLength: [2, "Name should have at least 2 characters"],
    maxLength: [30, "Name should have at most 30 characters"],
  },
  ticketMessage: {
    type: String,
    required: true,
    trim: true,
    minLength: [5, "Name should have at least 5 characters"],
    maxLength: [150, "Name should have at most 150 characters"],
  },
  ticketNumber: {
    type: String,
    required: true,
    trim: true,
    default: () => randomStr.rnd(),
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  resolvedAt: {
    type: Date,
  },
  createdBy: {
    type: ObjectId,
    ref: "User",
    trim: true,
  },
  resolvedBy: {
    type: ObjectId,
    ref: "Manager",
    trim: true,
  },
  resolveComment: {
    type: String,
    trim: true,
    maxLength: [150, "Name should have at most 150 characters"],
  },
});

export const Ticket = mongoose.model("Ticket", ticketSchema);

import mongoose, { Schema, Document } from "mongoose";
import type { IExperience } from "./Experience.js";

export interface IBooking extends Document {
  name: string,
  email: string,
  experienceId: mongoose.Types.ObjectId | IExperience;
  date: Date;
  slot: string;
  guests: number;
  promoCode?: string;
  discount?: number;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    experienceId: {
      type: Schema.Types.ObjectId,
      ref: "Experience",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    slot: {
      type: String,
      required: true,
      trim: true,
    },
    guests: {
      type: Number,
      required: true,
      min: [1, "At least one guest is required"],
      max: [20, "Maximum 20 guests per booking"],
    },
    promoCode: {
      type: String,
      trim: true,
      uppercase: true,
    },
    discount: {
      type: Number,
      min: 0,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: [0, "Total amount cannot be negative"],
    },
  },
  { timestamps: true }
);

// To Ensure unique booking per user per slot to avoid double-booking
bookingSchema.index(
  { name: 1, email: 1, experienceId: 1, date: 1, slot: 1 },
  { unique: true }
);

export const Booking = mongoose.model<IBooking>("Booking", bookingSchema);

import mongoose, { Schema, Document } from "mongoose";

interface ISlot {
  time: string; // "07:00 am"
  available: number; // number of seats left
}

interface IDateSlot {
  date: Date;
  slots: ISlot[];
}

export interface IExperience extends Document {
  title: string;
  description?: string;
  address: string;
  imageUrl?: string;
  price: number;
  taxes?: number;
  dates: IDateSlot[];
}

const slotSchema = new Schema<ISlot>(
  {
    time: { type: String, required: true },
    available: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const dateSlotSchema = new Schema<IDateSlot>(
  {
    date: { type: Date, required: true },
    slots: { type: [slotSchema], required: true },
  },
  { _id: false }
);

const experienceSchema = new Schema<IExperience>(
  {
    title: { type: String, required: true },
    description: { type: String },
    address: { type: String, required: true },
    imageUrl: { type: String },
    price: { type: Number, required: true },    // inr * 100
    taxes: { type: Number, default: 0 },    // inr * 100
    dates: { type: [dateSlotSchema], required: true },
  },
  { timestamps: true }
);

export const Experience = mongoose.model<IExperience>(
  "Experience",
  experienceSchema
);

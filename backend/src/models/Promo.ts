import mongoose, { Schema, Document } from "mongoose";

export interface IPromo extends Document {
  code: string;
  discountValue: number;
  minPurchase?: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  usageLimit?: number;
  usedCount: number;
}

const promoSchema = new Schema<IPromo>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    discountValue: {
      type: Number,
      required: true,
      min: [1, "Discount value must be at least 1"],
    },
    minPurchase: {
      type: Number,
      min: [0, "Minimum purchase cannot be negative"],
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (this: IPromo, v: Date) {
          return v > this.startDate;
        },
        message: "End date must be after start date",
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    usageLimit: {
      type: Number,
      min: [1, "Usage limit must be at least 1"],
    },
    usedCount: {
      type: Number,
      default: 0,
      min: [0, "Used count cannot be negative"],
    },
  },
  { timestamps: true }
);

export const Promo = mongoose.model<IPromo>("Promo", promoSchema);

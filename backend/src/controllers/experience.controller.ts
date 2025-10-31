import { type Request, type Response } from "express";
import mongoose from "mongoose";
import { Experience } from "../models/Experience.js";
import { Booking } from "../models/Booking.js";
import { Promo } from "../models/Promo.js";

export const getExperiences = async (req: Request, res: Response) => {
  try {
    const page = parseInt((req.query.page as string) || "1");
    const limit = parseInt((req.query.limit as string) || "10");
    const skip = (page - 1) * limit;

    const search = (req.query.search as string) || "";
    const query = search
      ? {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { address: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const total = await Experience.countDocuments(query);
    const experiences = await Experience.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      page,
      totalPages: Math.ceil(total / limit),
      total,
      experiences,
    });
  } catch (error) {
    console.error("Error fetching experiences:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getExperienceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id ?? '')) {
      return res.status(400).json({ success: false, message: "Invalid experience ID" });
    }

    const experience = await Experience.findById(id);

    if (!experience) {
      return res.status(404).json({ success: false, message: "Experience not found" });
    }

    res.status(200).json({ success: true, experience });
  } catch (error) {
    console.error("Error fetching experience:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const bookExperience = async (req: Request, res: Response) => {
  const experienceId = req.params.id;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      name,
      email,
      date,
      slot,
      guests,
      promoCode,
      totalAmount,
    } = req.body;

    if (
      !name ||
      !email ||
      !experienceId ||
      !date ||
      !slot ||
      !guests ||
      !totalAmount
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const experience = await Experience.findById(experienceId).session(session);
    if (!experience) {
      return res.status(404).json({
        success: false,
        message: "Experience not found",
      });
    }

    const dateObj = experience.dates.find(
      (d) => new Date(d.date).toDateString() === new Date(date).toDateString()
    );
    if (!dateObj) {
      return res.status(400).json({
        success: false,
        message: "Invalid or unavailable date selected",
      });
    }

    const slotObj = dateObj.slots.find((s) => s.time === slot);
    if (!slotObj) {
      return res.status(400).json({
        success: false,
        message: "Invalid slot selected",
      });
    }

    if (slotObj.available < guests) {
      return res.status(400).json({
        success: false,
        message: "Not enough available seats for this slot",
      });
    }

    let discount = 0;
    let appliedPromo: string | undefined;

    if (promoCode) {
      const promo = await Promo.findOne({ code: promoCode.toUpperCase() }).session(session);
      if (!promo) {
        throw new Error("Invalid promo code");
      }

      const now = new Date();
      if (!promo.isActive || now < promo.startDate || now > promo.endDate) {
        throw new Error("Promo is not active or expired");
      }

      if (promo.usageLimit && promo.usedCount >= promo.usageLimit) {
        throw new Error("Promo usage limit reached");
      }

      if (promo.minPurchase && totalAmount * 100 < promo.minPurchase) {
        throw new Error(`Minimum purchase of ₹${promo.minPurchase / 100} required`);
      }

      discount = promo.discountValue / 100;
      appliedPromo = promo.code;

      promo.usedCount += 1;
      await promo.save({ session });
    }

    const finalAmount = Math.max(0, totalAmount - discount);

    slotObj.available -= guests;
    await experience.save({ session });

    const booking = await Booking.create(
      [
        {
          name,
          email,
          experienceId,
          date,
          slot,
          guests,
          promoCode: appliedPromo,
          discount: discount * 100, // store in paise
          totalAmount: finalAmount * 100, // store in paise
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "Booking successful",
      booking: booking[0],
    });
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();

    console.error("Error booking experience:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to complete booking",
    });
  }
};

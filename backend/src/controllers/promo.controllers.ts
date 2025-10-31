import { type Request, type Response } from "express";
import { Promo } from "../models/Promo.js";

export const validatePromo = async (req: Request, res: Response) => {
  try {
    const { code, totalAmount } = req.body;

    if (!code || typeof code !== "string") {
      return res.status(400).json({
        success: false,
        message: "Promo code is required",
      });
    }

    if (!totalAmount || typeof totalAmount !== "number" || totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Total amount must be a positive number",
      });
    }

    // Convert rupees → paise for internal comparison
    const totalInPaise = Math.round(totalAmount * 100);

    const promo = await Promo.findOne({ code: code.toUpperCase() });

    if (!promo) {
      return res.status(404).json({
        success: false,
        message: "Promo code not found",
      });
    }

    const now = new Date();

    if (!promo.isActive) {
      return res.status(400).json({
        success: false,
        message: "Promo code is not active",
      });
    }

    if (now < promo.startDate || now > promo.endDate) {
      return res.status(400).json({
        success: false,
        message: "Promo code has expired or not yet active",
      });
    }

    if (promo.usageLimit && promo.usedCount >= promo.usageLimit) {
      return res.status(400).json({
        success: false,
        message: "Promo usage limit reached",
      });
    }

    if (promo.minPurchase && totalInPaise < promo.minPurchase) {
      return res.status(400).json({
        success: false,
        message: `Minimum purchase of ₹${promo.minPurchase / 100} required`,
      });
    }

    const discountInPaise = promo.discountValue;
    const finalAmountInPaise = Math.max(0, totalInPaise - discountInPaise);

    res.status(200).json({
      success: true,
      message: "Promo code applied successfully",
      data: {
        code: promo.code,
        discount: discountInPaise / 100,
        finalAmount: finalAmountInPaise / 100,
      },
    });
  } catch (error) {
    console.error("Error validating promo:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


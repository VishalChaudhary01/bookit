import "dotenv/config";
import mongoose from "mongoose";
import { Promo } from "../models/Promo.js";

const seedPromos = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL!);
    console.log("Connected to MongoDB");

    const promos = [
      {
        code: "SAVE10",
        discountValue: 10 * 100, // ₹10
        minPurchase: 200 * 100,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        isActive: true,
        usageLimit: 100,
        usedCount: 0,
      },
      {
        code: "FLAT100",
        discountValue: 100 * 100,
        minPurchase: 500 * 100,
        startDate: new Date(),
        endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days
        isActive: true,
        usageLimit: 50,
        usedCount: 0,
      },
      {
        code: "FIRST300",
        discountValue: 300 * 100,
        minPurchase: 1000 * 100,
        startDate: new Date(),
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
        isActive: true,
        usageLimit: 1,
        usedCount: 0,
      },
    ];

    await Promo.deleteMany({});
    console.log("Cleared existing promos");

    await Promo.insertMany(promos);
    console.log("Promos seeded successfully!");

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error seeding promos:", error);
    process.exit(1);
  }
};

seedPromos();

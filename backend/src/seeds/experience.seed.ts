import "dotenv/config";
import mongoose from "mongoose";
import { Experience } from "../models/Experience.js";

const seedExperiences = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL!);
    console.log("Connected to MongoDB");

    await Experience.deleteMany({});
    console.log("Old experiences removed");

    const experiences = Array.from({ length: 10 }).map((_, i) => {
      const baseDate = new Date();
      const randomDays = Math.floor(Math.random() * 10);
      const nextDate = new Date(baseDate);
      nextDate.setDate(baseDate.getDate() + randomDays);

      return {
        title: `Adventure ${i + 1}: ${["Kayaking", "Safari", "Hiking", "Diving", "Paragliding"][i % 5]}`,
        description: "Enjoy an unforgettable adventure with professional guides.",
        address: `Location ${i + 1}, India`,
        imageUrl: `https://picsum.photos/seed/experience${i}/800/400`,
        price: 1999 * 100,
        taxes: 199 * 100,
        dates: [
          {
            date: nextDate,
            slots: [
              { time: "07:00 am", available: Math.floor(Math.random() * 6) + 1 },
              { time: "11:00 am", available: Math.floor(Math.random() * 6) + 1 },
              { time: "03:00 pm", available: Math.floor(Math.random() * 6) + 1 },
            ],
          },
          {
            date: new Date(nextDate.getTime() + 24 * 60 * 60 * 1000),
            slots: [
              { time: "07:00 am", available: Math.floor(Math.random() * 6) + 1 },
              { time: "11:00 am", available: Math.floor(Math.random() * 6) + 1 },
              { time: "03:00 pm", available: Math.floor(Math.random() * 6) + 1 },
            ],
          },
        ],
      };
    });

    await Experience.insertMany(experiences);
    console.log("Seeded experiences successfully!");

  } catch (err) {
    console.error("Error seeding experiences:", err);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB connection closed");
  }
};

seedExperiences();

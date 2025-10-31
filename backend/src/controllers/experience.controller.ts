import { type Request, type Response } from "express";
import mongoose from "mongoose";
import { Experience } from "../models/Experience.js";

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

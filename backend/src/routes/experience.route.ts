import express from "express";
import { getExperiences, getExperienceById } from "../controllers/experience.controller.js";

const experienceRoutes = express.Router();

experienceRoutes.get("/", getExperiences);
experienceRoutes.get("/:id", getExperienceById);

export default experienceRoutes;

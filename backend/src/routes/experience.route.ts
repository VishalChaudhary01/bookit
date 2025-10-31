import express from "express";
import { getExperiences, getExperienceById, bookExperience } from "../controllers/experience.controller.js";

const experienceRoutes = express.Router();

experienceRoutes.get("/", getExperiences);
experienceRoutes.get("/:id", getExperienceById);
experienceRoutes.post('/:id/book', bookExperience);

export default experienceRoutes;

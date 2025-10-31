import { Router } from "express";
import experienceRoutes from "./experience.route.js";

const appRoutes = Router();

appRoutes.use('/experiences', experienceRoutes)

export default appRoutes;
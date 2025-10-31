import { Router } from "express";
import experienceRoutes from "./experience.route.js";
import promoRoutes from "./promo.route.js";

const appRoutes = Router();

appRoutes.use('/experiences', experienceRoutes)
appRoutes.use('/promo', promoRoutes)

export default appRoutes;
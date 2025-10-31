import express from "express";
import { validatePromo } from "../controllers/promo.controllers.js";

const promoRoutes = express.Router();

promoRoutes.post("/validate", validatePromo);

export default promoRoutes;

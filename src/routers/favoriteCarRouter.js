import express from "express";
import { authMiddleware, roleMiddleware } from "../middleware/auth.js";
import {
  addFavCars,
  deleteFavCars,
  getFavCars,
} from "../controllers/favouriteCarController.js";

const FavoriteCarRouter = express.Router();

//Get favorite cars
FavoriteCarRouter.get(
  "/",
  authMiddleware,
  roleMiddleware(["CUSTOMER", "ADMIN", "SELLER"]),
  getFavCars,
);
//Add favorite cars
FavoriteCarRouter.post(
  "/:id",
  authMiddleware,
  roleMiddleware(["CUSTOMER", "ADMIN", "SELLER"]),
  addFavCars,
);

//Delete favorite cars
FavoriteCarRouter.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["CUSTOMER", "ADMIN", "SELLER"]),
  deleteFavCars,
);

export default FavoriteCarRouter;

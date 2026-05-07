import express from "express";
import multer from "multer";
import { authMiddleware, roleMiddleware } from "../middleware/auth.js";
import {
  getAllCars,
  createCar,
  updateCar,
  deleteCar,
  sellerGetCars,
  getCarById,
} from "../controllers/carController.js";

const carRouter = express.Router();
const carImageFields = [
  { name: "img1", maxCount: 1 },
  { name: "img2", maxCount: 1 },
  { name: "img3", maxCount: 1 },
  { name: "img4", maxCount: 1 },
  { name: "img5", maxCount: 1 },
  { name: "img6", maxCount: 1 },
  { name: "img7", maxCount: 1 },
];

const upload = multer({ storage: multer.memoryStorage() });

//Get all cars by customer
carRouter.get("/", authMiddleware, getAllCars);

//Seller get all cars of him/herself
carRouter.get(
  "/my-cars",
  authMiddleware,
  roleMiddleware(["SELLER"]),
  sellerGetCars,
);

//Create car
carRouter.post(
  "/create-cars",
  authMiddleware,
  roleMiddleware(["SELLER", "ADMIN"]),
  upload.fields(carImageFields),
  createCar,
);

//Update car
carRouter.put(
  "/:carId",
  authMiddleware,
  roleMiddleware(["SELLER", "ADMIN"]),
  updateCar,
);
//Get exact cars by its Id
carRouter.get("/:id", authMiddleware, getCarById);

//Delete car
carRouter.delete(
  "/:carId",
  authMiddleware,
  roleMiddleware(["SELLER", "ADMIN"]),
  deleteCar,
);

export default carRouter;

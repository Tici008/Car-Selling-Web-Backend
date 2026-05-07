import express from "express";
import { authMiddleware, roleMiddleware } from "../middleware/auth.js";
import {
  getPersonalInfo,
  createPersonalInfo,
} from "../controllers/userController.js";

const userRouter = express.Router();

//Get personal information
userRouter.get("/profile", authMiddleware, getPersonalInfo);

//Create personal information
userRouter.post("/profile", authMiddleware, createPersonalInfo);

export default userRouter;

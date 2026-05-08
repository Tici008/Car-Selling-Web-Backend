import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import AccountModel from "./src/models/accounts.js";
import CustomerModel from "./src/models/customer.js";
import SellerModel from "./src/models/sellers.js";
import userRouter from "./src/routers/userRouter.js";
import carRouter from "./src/routers/carRouter.js";
import FavoriteCarRouter from "./src/routers/favoriteCarRouter.js";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
// Connect to MongoDB
await mongoose.connect(process.env.MONGODB_URL);

//Register
app.post("/register", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    //Check if email is already registered
    const existingAccount = await AccountModel.find({ email });
    if (existingAccount.length > 0) {
      return res.status(400).send({ message: "Email is already registered!" });
    }

    const hashedPassword = await bcrypt.hashSync(password, 5);
    const newAccount = {
      email: email,
      password: hashedPassword,
      isActive: true,
      role: role,
    };
    const createdAccount = await AccountModel.create(newAccount);

    res
      .status(201)
      .send({ message: "User created successfully!", data: createdAccount });
  } catch (err) {
    res
      .status(500)
      .send({ message: "Oops, Somethings went wrong!", error: err });
  }
});

//Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    //Check if it exists
    const account = await AccountModel.findOne({ email });
    if (!account) {
      throw new Error("Account not found!");
    }

    //Check if it is active
    if (!account.isActive) {
      throw new Error("Account is not active!");
    }

    //Check password
    const isPasswordValid = await bcrypt.compareSync(
      password,
      account.password,
    );

    if (!isPasswordValid) {
      throw new Error("Invalid password!");
    }

    //Generate token
    const token = jwt.sign(
      {
        id: account._id,
        role: account.role,
      },
      JWT_SECRET_KEY,
      { expiresIn: "1d" },
    );

    res.status(200).send({
      message: "Login successful!",
      token,
      isActivated: account.isActivated,
    });
  } catch (err) {
    res
      .status(500)
      .send({ message: "Oops, Somethings went wrong!", error: err });
  }
});

//Router
app.use("/users", userRouter);
app.use("/cars", carRouter);
app.use("/favorite-cars", FavoriteCarRouter);
app.listen(8080, () => {
  console.log("Server is running on port 8080");
});

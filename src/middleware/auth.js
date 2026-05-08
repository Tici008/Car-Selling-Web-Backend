import jwt from "jsonwebtoken";
import AccountModel from "../models/accounts.js";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

//Authentication account
export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    //Check if token exists
    if (!token) {
      return res.status(401).send({ message: "Token not found" });
    }

    //Check if account exists
    const decoded = await jwt.verify(token, JWT_SECRET_KEY);
    const account = await AccountModel.findById(decoded.id);

    if (!account || !account.isActive) {
      return res.status(401).send({ message: "Account not found or inactive" });
    }

    req.user = {
      accountId: decoded.id,
      role: decoded.role,
    };
    next();
  } catch (err) {
    res.status(401).send({ message: "Fail", error: err });
  }
};

//Authorization role
export const roleMiddleware = (allowedRoles) => {
  try {
    return (req, res, next) => {
      const { role } = req.user;
      if (!allowedRoles.includes(role)) {
        return res.status(403).send({ message: "Access denied!" });
      }
      next();
    };
  } catch (err) {
    res.status(403).send({ message: "Forbidden", error: err });
  }
};

import bcrypt from "bcryptjs";
import AccountModel from "../models/accounts.js";
import CustomerModel from "../models/customer.js";
import SellerModel from "../models/sellers.js";
import AdminModel from "../models/admins.js";
import { v2 as cloudinary } from "cloudinary";
import CarModel from "../models/cars.js";
import dotenv from "dotenv";
import FavoriteCarModel from "../models/favouriteCar.js";

dotenv.config();

cloudinary.config({
  cloud_name: "dhxzjmkbd",
  api_key: "474912522415436",
  api_secret: process.env.api_secret,
});

const uploadImageToCloudinary = async (file) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "cars" },
      (error, result) => {
        if (error) {
          console.log("Error uploading image to Cloudinary:", error);
          reject(error);
        } else {
          console.log("Image uploaded to Cloudinary successfully:", result);
          resolve(result);
        }
      },
    );
    stream.end(file.buffer);
  });
};

//Get all cars by customers
export const getAllCars = async (req, res) => {
  try {
    const { accountId, role } = req.user;
    const cars = await CarModel.find().populate("sellerId", "name email");
    const favListCars = await FavoriteCarModel.find({ accountId: accountId });
    const favCarIds = favListCars.map((fav) => fav.carId.toString());
    console.log("Danh sách xe yêu thích của khách hàng:", favListCars); // Thêm dòng này để kiểm tra danh sách xe yêu thích của khách hàng
    const carsWithFav = cars.map((car) => {
      return {
        ...car.toObject(),
        isLiked: favCarIds.includes(car._id.toString()),
      };
    });

    res.status(200).send({
      message: "Cars retrieved successfully!",
      cars: carsWithFav,
      check: favCarIds,
    });
  } catch (err) {
    res
      .status(500)
      .send({ message: "Oops, Somethings went wrong!", error: err });
  }
};

//Create car by seller and admin
export const createCar = async (req, res) => {
  try {
    const { accountId, role } = req.user;

    //Check role
    if (!["SELLER", "ADMIN"].includes(role)) {
      return res.status(403).send({
        message: "Only admins and sellers are allowed to create cars.",
      });
    }
    const carInformation = { ...req.body };

    //Check if the seller exists
    const seller = await SellerModel.findOne({ accountId });

    if (!seller) {
      return res.status(404).send({ message: "Seller not found." });
    }

    //_______________________//
    //Create new car

    //1. Check if image is provided
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: "No image uploaded" });
      console.log("No image uploaded"); // Thêm dòng này để kiểm tra nếu không có hình ảnh nào được tải lên
    }

    const imagesData = {};
    const uploadPromises = [];
    //2. Upload image to cloudinary
    Object.keys(req.files).forEach((fieldName) => {
      const file = req.files[fieldName][0];

      const promise = uploadImageToCloudinary(file).then((result) => {
        imagesData[fieldName] = result.secure_url;
      });

      uploadPromises.push(promise);
    });

    await Promise.all(uploadPromises);

    console.log("imagesData:", imagesData); // Thêm dòng này để kiểm tra dữ liệu hình ảnh sau khi tải lên

    const newCar = await CarModel.create({
      ...carInformation,
      sellerId: seller._id,
      ...imagesData,
    });

    res.status(201).send({ message: "Car created successfully!", car: newCar });
  } catch (err) {
    console.error("Chi tiết lỗi:", err.message); // ← thêm dòng này
    res
      .status(500)
      .send({ message: "Oops, Somethings went wrong!", error: err.message });
  }
};

//Get exact cars by its Id
export const getCarById = async (req, res) => {
  try {
    const { id } = req.params;
    const car = await CarModel.findById(id).populate(
      "sellerId",
      "name email phone",
    );
    res.status(200).send({ message: "Car retrieved successfully!", car: car });
  } catch (err) {
    res
      .status(500)
      .send({ message: "Oops, Somethings went wrong!", error: err });
  }
};

//Update cars information by seller and admin
export const updateCar = async (req, res) => {
  try {
    const { accountId, role } = req.user;
    const { carId } = req.params;

    //Check role
    if (!["SELLER", "ADMIN"].includes(role)) {
      return res.status(403).send({
        message: "Only admins and sellers are allowed to update cars.",
      });
    }

    //Check if car exists
    const car = await CarModel.findById(carId);
    if (!car) {
      return res.status(404).send({ message: "Car not found." });
    }
    const seller = await SellerModel.findOne({ accountId: accountId });
    if (!seller) {
      return res.status(404).send({ message: "Seller not found." });
    }
    //Check if the seller is the owner of the car
    if (
      role === "SELLER" &&
      car.sellerId.toString() !== seller._id.toString()
    ) {
      return res
        .status(403)
        .send({ message: "You are not authorized to update this car." });
    }

    //Update car information
    const information = { ...req.body };
    let newInformation = {};
    for (const key in information) {
      if (information[key] !== undefined && information[key] !== null) {
        newInformation[key] = information[key];
      }
    }

    const updatedCar = await CarModel.findByIdAndUpdate(
      carId,
      { $set: newInformation },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedCar) {
      return res.status(404).json({ message: "Car not found" });
    }

    res
      .status(200)
      .send({ message: "Car updated successfully!", car: updatedCar });
  } catch (err) {
    console.log("Chi tiết lỗi:", err.message); // ← thêm dòng này để kiểm tra chi tiết lỗi
    res
      .status(500)
      .send({ message: "Opps, Somethings went wrong!", error: err });
  }
};

//Delete car by seller and admin
export const deleteCar = async (req, res) => {
  try {
    const { accountId, role } = req.user;
    const { carId } = req.params;

    //Check role
    if (!["SELLER", "ADMIN"].includes(role)) {
      return res.status(403).send({
        message: "Only admins and sellers are allowed to delete cars.",
      });
    }

    //Check if car exists
    const car = await CarModel.findById(carId);
    if (!car) {
      return res.status(404).send({ message: "Car not found." });
    }
    const seller = await SellerModel.findOne({ accountId: accountId });
    if (!seller) {
      return res.status(404).send({ message: "Seller not found." });
    }
    //Check if the seller is the owner of the car
    if (
      role === "SELLER" &&
      car.sellerId.toString() !== seller._id.toString()
    ) {
      return res
        .status(403)
        .send({ message: "You are not authorized to delete this car." });
    }

    await CarModel.findByIdAndDelete(carId);
    res.status(200).send({ message: "Car deleted successfully!" });

    //--------------//
  } catch (err) {
    res
      .status(500)
      .send({ message: "Oops, Somethings went wrong!", error: err });
  }
};

//Seller get all cars that they supervise
export const sellerGetCars = async (req, res) => {
  try {
    const { accountId, role } = req.user;

    //Check role
    if (role !== "SELLER") {
      return res.status(403).send({
        message: "Only sellers are allowed to view their cars.",
      });
    }

    const seller = await SellerModel.findOne({ accountId: accountId });
    if (!seller) {
      return res
        .status(404)
        .send({ message: "Không tìm thấy hồ sơ người bán." });
    }
    //Get all cars supervised by the seller
    const cars = await CarModel.find({ sellerId: seller._id }).populate(
      "sellerId",
      "name email",
    );
    res.status(200).send({ message: "Cars retrieved successfully!", cars });
  } catch (err) {
    res
      .status(500)
      .send({ message: "Opps, Somethings went wrong!", error: err });
  }
};

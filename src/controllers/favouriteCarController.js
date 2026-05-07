import CarModel from "../models/cars.js";
import FavoriteCarModel from "../models/favouriteCar.js";
import AccountModel from "../models/accounts.js";

// Thêm favorite cars
export const addFavCars = async (req, res) => {
  try {
    const { accountId, role } = req.user;
    const { id } = req.params;

    //Find customer
    const account = await AccountModel.findOne({ _id: accountId });
    if (!account) {
      return res.status(404).send({
        message: "Customer don't exist",
      });
    }

    //Find car
    const car = await CarModel.findOne({ _id: id });
    if (!car) {
      return res.status(404).send({
        message: "Car don't exist",
      });
    }

    //Add favorite car
    const fav = await FavoriteCarModel.create({
      name: car.name,
      accountId: account._id,
      carId: car._id,
      created_at: Date.now(),
    });
    return res.status(201).send({ message: "Favorite added", favCar: fav });
  } catch (err) {
    console.log("Chi tiết lỗi:", err.message); // ← thêm dòng này để kiểm tra chi tiết lỗi
    return res
      .status(500)
      .json({ message: "Có lỗi xảy ra khi thêm xe yêu thích" });
  }
};

//Delete favorite cars
export const deleteFavCars = async (req, res) => {
  try {
    const { accountId, role } = req.user;
    const { id } = req.params;

    //Find customer
    const account = await AccountModel.findOne({ _id: accountId });
    if (!account) {
      return res.status(404).send({
        message: "Customer don't exist",
      });
    }

    //Find car
    const car = await CarModel.findOne({ _id: id });
    if (!car) {
      return res.status(404).send({
        message: "Car don't exist",
      });
    }

    //Delete favorite car
    const result = await FavoriteCarModel.findOneAndDelete({
      accountId: accountId,
      carId: car._id,
    });

    return res
      .status(201)
      .send({ message: "Favorite deleted", result: result });
  } catch (err) {
    console.log("Chi tiết lỗi:", err.message); // ← thêm dòng này để kiểm tra chi tiết lỗi
    return res
      .status(500)
      .json({ message: "Có lỗi xảy ra khi xoá xe yêu thích" });
  }
};

//Lấy danh sách favorite cars của khách hàng
export const getFavCars = async (req, res) => {
  try {
    const { accountId, role } = req.user;

    //Find Account
    const account = await AccountModel.findOne({ _id: accountId });
    if (!account) {
      return res.status(404).send({
        message: "Account don't exist",
      });
    }
    //Find favorites cars
    const favCars = await FavoriteCarModel.find({
      accountId: accountId,
    }).populate(
      "carId",
      "img1 name cost location date type fuel seats review _id",
    );
    return res
      .status(200)
      .send({ message: "Get favorite cars successfully", cars: favCars });
  } catch (err) {
    console.log("Chi tiết lỗi:", err.message); // ← thêm dòng này để kiểm tra chi tiết lỗi
    return res
      .status(500)
      .json({ message: "Có lỗi xảy ra khi lấy danh sách xe yêu thích" });
  }
};

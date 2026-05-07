import AccountModel from "../models/accounts.js ";
import CustomerModel from "../models/customer.js";
import SellerModel from "../models/sellers.js";
import AdminModel from "../models/admins.js";

//Get Personal Information according to role
export const getPersonalInfo = async (req, res) => {
  try {
    const { accountId, role } = req.user;
    let personalInfo = null;

    //Find personal information based on role
    switch (role) {
      case "CUSTOMER":
        personalInfo = await CustomerModel.findOne({ accountId });
        break;
      case "SELLER":
        personalInfo = await SellerModel.findOne({ accountId });
        break;
      case "ADMIN":
        personalInfo = await AdminModel.findOne({ accountId });
        break;
      default:
        return res.status(400).send({ message: "Invalid role" });
    }

    if (!personalInfo) {
      return res
        .status(404)
        .send({ message: "Personal information not found" });
    }

    res.status(200).send(personalInfo);
  } catch (err) {
    res
      .status(500)
      .send({ message: "Opps, Somethings went wrong!", error: err });
  }
};

//Create personal information according to role
export const createPersonalInfo = async (req, res) => {
  try {
    const { accountId, role } = req.user;
    const { name, email, phone, address } = req.body;
    console.log(accountId, role);
    let personalInfo;

    //Create personal information based on role
    switch (role) {
      //Customer
      case "CUSTOMER":
        const existingCustomer = await CustomerModel.findOne({ accountId });
        if (existingCustomer) {
          return res
            .status(400)
            .send({ message: "Personal information already exists" });
        }
        personalInfo = await CustomerModel.create({
          name,
          email,
          phone,
          address,
          accountId,
        });
        updatedAccount = await AccountModel.findByIdAndUpdate(
          accountId,
          { isActivated: true },
          { new: true },
        );
        break;
      //Seller
      case "SELLER":
        const existingSeller = await SellerModel.findOne({ accountId });
        if (existingSeller) {
          return res
            .status(400)
            .send({ message: "Personal information already exists" });
        }
        personalInfo = await SellerModel.create({
          name,
          email,
          phone,
          address,
          accountId,
        });
        updatedAccount = await AccountModel.findByIdAndUpdate(
          accountId,
          { isActivated: true },
          { new: true },
        );

        break;

      //Admin
      case "ADMIN":
        const existingAdmin = await AdminModel.findOne({ accountId });
        if (existingAdmin) {
          return res
            .status(400)
            .send({ message: "Personal information already exists" });
        }
        personalInfo = await AdminModel.create({
          name,
          email,
          phone,
          address,
          accountId,
        });
        updatedAccount = await AccountModel.findByIdAndUpdate(
          accountId,
          { isActivated: true },
          { new: true },
        );
        break;
    }

    res.status(201).send({
      message: "Personal information created successfully!",
      data: personalInfo,
      isSuccess: true,
      update: updatedAccount,
    });
  } catch (err) {
    res
      .status(500)
      .send({ message: "Oops, Somethings went wrong!", error: err });
  }
};

//Update personal information according to role
export const updatePersonalInfo = async (req, res) => {
  try {
    const { accountId, role } = req.user;
    const { name, email, phone, address } = req.body;

    //Check role and update accordingly
    let personalInfo;
    switch (role) {
      case "CUSTOMER":
        personalInfo = await CustomerModel.findByIdAndUpdate(
          accountId,
          { $set: { name, email, phone, address } },
          { new: true, runValidators: true },
        );
        break;
      case "SELLER":
        personalInfo = await SellerModel.findByIdAndUpdate(
          accountId,
          { $set: { name, email, phone, address } },
          { new: true, runValidators: true },
        );
        break;
    }
  } catch (err) {
    return res
      .status(500)
      .send({ message: "Oops, Somethings went wrong!", error: err.message });
  }
};

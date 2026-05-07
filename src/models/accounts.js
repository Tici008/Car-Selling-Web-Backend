import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isActivated: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ["ADMIN", "CUSTOMER", "SELLER"],
    default: "CUSTOMER",
  },
});

const AccountModel = mongoose.model("accounts", accountSchema);
export default AccountModel;

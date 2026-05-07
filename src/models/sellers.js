import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  phone: Number,
  address: String,
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "accounts",
  },
});
const SellerModel = mongoose.model("sellers", sellerSchema);

export default SellerModel;

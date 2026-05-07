import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  phone: {
    type: Number,
  },
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "accounts",
  },
});

const AdminModel = mongoose.model("admins", adminSchema);
export default AdminModel;

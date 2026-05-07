import mongoose from "mongoose";

const favoriteCarSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "accounts",
  },
  carId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "cars",
  },
  created_at: Number,
});
const FavoriteCarModel = mongoose.model("favoritecars", favoriteCarSchema);

export default FavoriteCarModel;

import mongoose from "mongoose";

const carSchema = mongoose.Schema({
  name: String,
  img1: String,
  img2: String,
  img3: String,
  img4: String,
  img5: String,
  img6: String,
  img7: String,
  //
  cost: { type: Number, required: true, min: 0 },
  location: String,
  type: String,
  fuel: String,
  date: Number,
  peopleLimit: Number,
  review: Number,
  //
  brand: String,
  model: String,
  condition: String,
  year: String,
  bodyType: String,
  seats: String,
  exteriorColor: String,
  //
  fuelType: String,
  mileage: String,
  transmission: String,
  driveTrain: String,
  power: String,
  //
  batteryCapacity: String,
  chargeSpeed: String,
  chargePort: String,
  chargeTime: String,
  //
  engine: String,
  engineTorque: String,
  fuelTankCapacity: String,
  fuelConsumption: String,
  //
  length: String,
  width: String,
  height: String,
  cargoVolume: String,
  //
  description: String,
  //
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "sellers",
  },
});
const CarModel = mongoose.model("cars", carSchema);
export default CarModel;

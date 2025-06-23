import mongoose, { Schema, model, models } from "mongoose";

const LocationSchema = new Schema(
  {
    address: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    shortName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Location = models.Location || model("Location", LocationSchema);
export default Location;

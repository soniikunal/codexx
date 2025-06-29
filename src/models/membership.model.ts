import mongoose, { Schema, Document } from "mongoose";

export interface IMembership extends Document {
  billingPeriodMonth: string;
  cost: string;
  name: string;
  numberOfDaysInWeek: string;
  stripePriceId: string;
  type: string;
  unit: string;
}

const membershipSchema: Schema = new Schema(
  {
    billingPeriodMonth: { type: String, required: true },
    cost: { type: String, required: true },
    name: { type: String, required: true },
    numberOfDaysInWeek: { type: String, required: true },
    stripePriceId: { type: String, required: true },
    type: { type: String, required: true },
    unit: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Membership ||
  mongoose.model<IMembership>("Membership", membershipSchema);

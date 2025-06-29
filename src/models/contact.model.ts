import mongoose, { Document, Schema } from "mongoose";

export interface IContact extends Document {
  name: string;
  email: string;
  phone: string;
  message: string;
  course: string;
}

const ContactSchema = new Schema<IContact>(
  {
    name: { type: String },
    email: { type: String },
    phone: { type: String },
    message: { type: String },
    course: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Contact ||
  mongoose.model<IContact>("Contact", ContactSchema);

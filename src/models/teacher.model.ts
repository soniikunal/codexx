import mongoose, { Document, Schema, model, models } from "mongoose";

// 1. Define TypeScript Interface for Type Safety
export interface ITeacher extends Document {
  name: string;
  address: string;
  educationalDetail: string;
  description?: string;
  profile_url: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// 2. Define the Mongoose Schema
const TeacherSchema = new Schema<ITeacher>(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    educationalDetail: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    profile_url: {
      type: String,
      // required: true,
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt
);

// 3. Export the model
const Teacher = models.Teacher || model<ITeacher>("Teacher", TeacherSchema);
export default Teacher;

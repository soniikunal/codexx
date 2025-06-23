import mongoose, { Schema, model, models } from "mongoose";

const TeacherSchema = new Schema(
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
      required: true,
    },
  },
  { timestamps: true }
);

const Teacher = models.Teacher || model("Teacher", TeacherSchema);
export default Teacher;

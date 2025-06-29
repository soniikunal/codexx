import mongoose from "mongoose";

const ProgramSchema = new mongoose.Schema(
  {
    pk: {
      type: String,
      enum: ["PROG_SCIENCE", "PROG_MATH", "PROG_CODING"],
      required: true,
    },
    courseName: { type: String, required: true },
    ageRange: { type: String, required: true },
    description: { type: String },
    headerTitle: { type: String },
    thumbnailImage: { type: String }, // file path or URL
    location: [
      {
        name: { type: String, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        instructor: { type: String, required: true },
      },
    ],
    schedule: {
      type: mongoose.Schema.Types.Mixed, // flexible weekday-object
      default: {},
    },
    program: { type: String },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Inactive",
    },
    maxEnrollment: { type: Number },
    startDate: { type: Date },
    endDate: { type: Date },
    inPerson: { type: Boolean },
    remote: { type: Boolean },
  },
  { timestamps: true }
);

export default mongoose.models.Program ||
  mongoose.model("Program", ProgramSchema);

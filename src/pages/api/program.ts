import type { NextApiRequest, NextApiResponse } from "next";
import formidable, { File as FormidableFile } from "formidable";
import { uploadToS3 } from "@/lib/s3Upload";
import dbConnect from "@/lib/dbConnect";
import Program from "@/models/program.model";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  if (req.method === "POST" || req.method === "PUT") {
    const form = formidable({
      multiples: false,
      uploadDir: "./public/uploads",
      keepExtensions: true,
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Form parse error:", err);
        return res.status(500).json({ error: "Error parsing form data" });
      }

      try {
        let imageUrl = "";
        const photo = files.photo as unknown as FormidableFile;
        if (photo) {
          const file = Array.isArray(files.photo)
            ? files.photo[0]
            : files.photo;
          if (!file || !file.filepath) {
            return res
              .status(400)
              .json({ error: "No file uploaded or filepath missing" });
          }

          imageUrl = await uploadToS3(file);
        }

        const programData: {
          pk?: string;
          courseName?: string;
          ageRange?: string;
          description?: string;
          headerTitle?: string;
          program?: string;
          status?: string;
          maxEnrollment?: number;
          startDate?: Date;
          endDate?: Date;
          inPerson?: boolean;
          remote?: boolean;
          location: any;
          schedule: any;
          thumbnailImage?: string;
        } = {
          pk: fields.pk?.toString(),
          courseName: fields.courseName?.toString(),
          ageRange: fields.ageRange?.toString(),
          description: fields.description?.toString(),
          headerTitle: fields.headerTitle?.toString(),
          program: fields.program?.toString(),
          status: fields.status?.toString(),
          maxEnrollment: Number(fields.maxEnrollment),
          startDate: new Date(fields.startDate as unknown as string),
          endDate: new Date(fields.endDate as unknown as string),
          inPerson: fields.inPerson?.toString() === "true",
          remote: fields.remote?.toString() === "true",
          location: JSON.parse(fields.location as unknown as string),
          schedule: JSON.parse(fields.schedule as unknown as string),
        };

        if (imageUrl) {
          programData.thumbnailImage = imageUrl;
        }

        if (req.method === "POST") {
          const newProgram = await Program.create(programData);
          return res.status(201).json(newProgram);
        }

        if (req.method === "PUT") {
          const { id } = req.query;
          if (!id) {
            return res.status(400).json({ error: "Missing _id for update" });
          }

          const updated = await Program.findByIdAndUpdate(id, programData, {
            new: true,
          });

          return res.status(200).json(updated);
        }
      } catch (error: any) {
        console.error("Program save failed:", error);
        return res.status(500).json({ error: error.message || "Server error" });
      }
    });
  } else if (req.method === "DELETE") {
    const { id } = req.query;
    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "Missing or invalid ID" });
    }

    try {
      await Program.findByIdAndDelete(id);
      return res.status(200).json({ message: "Program deleted successfully" });
    } catch (err: any) {
      console.error("Delete error:", err);
      return res.status(500).json({ error: "Failed to delete program" });
    }
  } else if (req.method === "GET") {
    try {
      const programs = await Program.find().sort({ createdAt: -1 });
      return res.status(200).json(programs);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  } else {
    res.setHeader("Allow", ["POST", "PUT", "DELETE", "GET"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}

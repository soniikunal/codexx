import type { NextApiRequest, NextApiResponse } from "next";
import formidable, { File as FormidableFile } from "formidable";
import { uploadToS3 } from "@/lib/s3Upload";
import dbConnect from "@/lib/dbConnect";
import Teacher from "@/models/teacher.model";

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

  const {
    query: { id },
    method,
  } = req;

  if (method === "GET") {
    try {
      const teacher = await Teacher.findById(id);
      if (!teacher) {
        return res.status(404).json({ error: "Teacher not found" });
      }
      return res.status(200).json(teacher);
    } catch (error) {
      return res.status(500).json({ error: "Error fetching teacher" });
    }
  }

  if (method === "DELETE") {
    try {
      await Teacher.findByIdAndDelete(id);
      return res.status(200).json({ message: "Teacher deleted" });
    } catch (error) {
      return res.status(500).json({ error: "Error deleting teacher" });
    }
  }

  if (method === "PUT") {
    const form = formidable({
      multiples: false,
      keepExtensions: true,
      uploadDir: "./public/uploads",
    });

    form.parse(req, async (err, fields, files) => {
      if (err) return res.status(500).json({ error: "Error parsing form" });

      try {
        let imageUrl = fields.existingProfileUrl?.toString() || "";

        const file = Array.isArray(files.photo) ? files.photo[0] : files.photo;

        if (file && file.filepath) {
          imageUrl = await uploadToS3(file);
        }

        const updatedTeacher = await Teacher.findByIdAndUpdate(
          id,
          {
            name: fields.name?.toString(),
            address: fields.address?.toString(),
            educationalDetail: fields.educationalDetail?.toString(),
            description: fields.description?.toString(),
            profile_url: imageUrl,
          },
          { new: true }
        );

        return res.status(200).json(updatedTeacher);
      } catch (error: any) {
        return res.status(500).json({ error: error.message });
      }
    });

    return; // Required to prevent "API resolved without sending response" warning
  }

  res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
  return res.status(405).json({ error: `Method ${method} not allowed` });
}

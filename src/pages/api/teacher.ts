import type { NextApiRequest, NextApiResponse } from "next";
import formidable, { File as FormidableFile } from "formidable";
import { uploadToS3 } from "@/lib/s3Upload";
import dbConnect from "@/lib/dbConnect";
import Teacher from "@/models/teacher.model";

// Disable Next.js body parsing (required for formidable)
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

  if (req.method === "POST") {
    const form = formidable({
      multiples: false,
      uploadDir: "./public/uploads", // or a temp folder
      keepExtensions: true,
      // filename: (name, ext, part) => {
      //   return `${Date.now()}-${part.originalFilename}`;
      // },
    });

    // const form = formidable({ multiples: false });

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
          console.log("imageUrl");
          console.log(imageUrl);
        }

        const newTeacher = await Teacher.create({
          name: fields.name?.toString(),
          address: fields.address?.toString(),
          educationalDetail: fields.educationalDetail?.toString(),
          description: fields.description?.toString(),
          profile_url: imageUrl,
        });

        return res.status(201).json(newTeacher);
      } catch (error: any) {
        console.error("Teacher creation failed:", error);
        return res.status(500).json({ error: error.message || "Server error" });
      }
    });
  } else if (req.method === "GET") {
    try {
      const teachers = await Teacher.find().sort({ createdAt: -1 });
      return res.status(200).json(teachers);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}

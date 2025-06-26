import { File as FormidableFile } from "formidable";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";
import mime from "mime-types";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function uploadToS3(file: FormidableFile): Promise<string> {
  const filePath = file.filepath;

  if (!filePath) {
    throw new Error("Filepath is missing");
  }

  const fileStream = fs.createReadStream(filePath);
  const fileExtension = path.extname(file.originalFilename || "");
  const contentType = mime.lookup(fileExtension) || "application/octet-stream";

  const fileKey = `uploads/${Date.now()}-${file.originalFilename}`;
  console.log(fileKey + "fileKey");

  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: fileKey,
    Body: fileStream,
    ContentType: contentType,
  };
  console.log("object");
  console.log(process.env.AWS_BUCKET_NAME);
  await s3.send(new PutObjectCommand(uploadParams));

  return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
}

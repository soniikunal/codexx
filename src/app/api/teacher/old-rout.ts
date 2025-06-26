// src/app/api/teacher/route.ts
import { NextRequest, NextResponse } from "next/server";
import formidable, { File as FormidableFile } from "formidable";
import { IncomingMessage } from "http";
import { Readable } from "stream";
import { uploadToS3 } from "@/lib/s3Upload";
import dbConnect from "@/lib/dbConnect";
import Teacher from "@/models/teacher.model";

export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper: convert NextRequest to fake IncomingMessage
async function toIncomingMessage(req: NextRequest): Promise<IncomingMessage> {
  const { Readable } = await import("stream");
  const body = req.body;
  const headers = Object.fromEntries(req.headers.entries());

  const stream = Readable.from(body as any);
  const incoming = Object.assign(stream, {
    headers,
    method: req.method,
    url: req.url || "",
  });

  return incoming as unknown as IncomingMessage;
}

// Helper: parse form data
async function parseForm(req: NextRequest) {
  const form = formidable({ multiples: false });
  const incomingReq = await toIncomingMessage(req);

  return new Promise<{ fields: formidable.Fields; files: formidable.Files }>(
    (resolve, reject) => {
      form.parse(incomingReq, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    }
  );
}

// POST: Upload + Save
export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const { fields, files } = await parseForm(req);

    const photo = files.photo as unknown as FormidableFile;
    let imageUrl = "";

    if (photo) {
      imageUrl = await uploadToS3(photo as any);
    }

    const newTeacher = await Teacher.create({
      name: fields.name?.toString(),
      address: fields.address?.toString(),
      educationalDetail: fields.educationalDetail?.toString(),
      description: fields.description?.toString(),
      profile_url: imageUrl,
    });

    return NextResponse.json(newTeacher, { status: 201 });
  } catch (err: any) {
    console.error("POST error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// GET: Fetch Teachers
export async function GET() {
  await dbConnect();

  try {
    const teachers = await Teacher.find().sort({ createdAt: -1 });
    return NextResponse.json(teachers, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbConnect";
import Teacher from "@/models/teacher.model";
// import nextConnect from "next-connect";
// import multer from "@/lib/multer";
// GET all teachers
export async function GET() {
  await dbConnect();

  try {
    const teachers = await Teacher.find();
    return NextResponse.json(teachers);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching teachers" },
      { status: 500 }
    );
  }
}

// POST create new teacher
export async function POST(req: Request) {
  await dbConnect();
  const body = await req.json();

  try {
    const teacher = await Teacher.create(body);
    return NextResponse.json(teacher, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error creating teacher" },
      { status: 400 }
    );
  }
}

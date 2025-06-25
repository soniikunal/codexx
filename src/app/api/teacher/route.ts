import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Teacher, { ITeacher } from "@/models/teacher.model";
import { handleMulterUpload, MulterRequest } from "@/lib/multerConfig";

// GET all teachers
export async function GET(): Promise<NextResponse> {
  await dbConnect();

  try {
    const teachers: ITeacher[] = await Teacher.find();
    return NextResponse.json(teachers);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error fetching teachers" },
      { status: 500 }
    );
  }
}

// POST create new teacher with photo upload
export async function POST(req: MulterRequest): Promise<NextResponse> {
  await dbConnect();

  try {
    console.log(req);
    // Parse form data with Multer
    const file = await handleMulterUpload("photo")(req);

    // Parse the remaining form data
    const body = await req.formData();
    const teacherData: Partial<ITeacher> = {};
    for (const [key, value] of body.entries()) {
      if (key !== "photo") {
        teacherData[key as keyof ITeacher] = value as any; // Type assertion for simplicity
      }
    }

    // Add the uploaded file path to teacher data
    if (file) {
      teacherData.profile_url = `/uploads/${file.filename}`;
    }
    return NextResponse.json(body, { status: 201 });

    // Create teacher in database
    const teacher: ITeacher = await Teacher.create(teacherData);
    return NextResponse.json(teacher, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "Error creating teacher" },
      { status: 400 }
    );
  }
}

// Handle unsupported methods
export async function OPTIONS(): Promise<NextResponse> {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

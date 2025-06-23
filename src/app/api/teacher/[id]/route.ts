import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Teacher from "@/models/teacher.model";

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();

  try {
    const teacher = await Teacher.findById(params.id);
    if (!teacher) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
    }
    return NextResponse.json(teacher);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching teacher" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  const data = await req.json();

  try {
    const updated = await Teacher.findByIdAndUpdate(params.id, data, {
      new: true,
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: "Error updating teacher" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();

  try {
    await Teacher.findByIdAndDelete(params.id);
    return NextResponse.json({ message: "Teacher deleted" });
  } catch (error) {
    return NextResponse.json(
      { error: "Error deleting teacher" },
      { status: 500 }
    );
  }
}

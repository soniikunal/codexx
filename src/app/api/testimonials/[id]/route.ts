import dbConnect from "@/lib/dbConnect";
import Testimonial from "@/models/testimonial.model";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  const body = await req.json();
  const updated = await Testimonial.findByIdAndUpdate(params.id, body, {
    new: true,
  });
  return NextResponse.json(updated);
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  await Testimonial.findByIdAndDelete(params.id);
  return NextResponse.json({ message: "Deleted successfully" });
}

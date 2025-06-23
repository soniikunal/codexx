import dbConnect from "@/lib/dbConnect";
import Testimonial from "@/models/testimonial.model";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();
  const data = await Testimonial.find().sort({ createdAt: -1 });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  await dbConnect();
  const body = await req.json();
  const newTestimonial = await Testimonial.create(body);
  return NextResponse.json(newTestimonial, { status: 201 });
}

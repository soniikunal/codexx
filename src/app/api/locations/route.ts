import dbConnect from "@/lib/dbConnect";
import Location from "@/models/location.model";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();
  const locations = await Location.find().sort({ createdAt: -1 });
  return NextResponse.json(locations);
}

export async function POST(req: Request) {
  await dbConnect();
  const body = await req.json();
  const newLocation = await Location.create(body);
  return NextResponse.json(newLocation, { status: 201 });
}

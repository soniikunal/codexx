import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Enrollment from "@/models/enrollment.model";
import "@/models/membership.model";
// Handle POST request
export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    const newEnrollment = await Enrollment.create({
      ...body,
      createdAt: new Date(),
    });
    //   membership: {
    //     ...body.membership,
    //     membershipId: body.membership.pk, // Map pk to membershipId
    //   },

    return NextResponse.json(newEnrollment, { status: 201 });
  } catch (error) {
    console.error("POST /api/subscription:", error);
    return NextResponse.json(
      { error: "Failed to create subscription" },
      { status: 500 }
    );
  }
}

// Handle GET request
export async function GET() {
  try {
    await dbConnect();

    const subscriptions = await Enrollment.find().populate(
      "membership.membershipId"
    );
    return NextResponse.json(subscriptions, { status: 200 });
  } catch (error) {
    console.error("GET /api/subscription:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscriptions" },
      { status: 500 }
    );
  }
}

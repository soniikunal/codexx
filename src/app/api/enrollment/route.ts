import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Enrollment from "@/models/enrollment.model";
import "@/models/membership.model";
import { Parser } from "json2csv";

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
export async function GET(req: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const isCSV = searchParams.get("export") === "csv";
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const regex = query ? new RegExp(query, "i") : null;

    const filter: any = {};

    // Full-text-like search across nested fields
    if (regex) {
      filter.$or = [
        { courseName: regex },
        { sk: regex },
        { "familyInfo.name": regex },
        { "familyInfo.email": regex },
        { "studentInfo.firstName": regex },
        { "studentInfo.lastName": regex },
        { "membership.membershipId.name": regex },
        { "paymentInfo.card.last4": regex },
      ];
    }

    // Date range filter
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      Enrollment.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("membership.membershipId"),
      Enrollment.countDocuments(filter),
    ]);

    return NextResponse.json({ data, total }, { status: 200 });
  } catch (error) {
    console.error("GET /api/subscription:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscriptions" },
      { status: 500 }
    );
  }
}

// if (isCSV) {
//   const rawData = await Enrollment.find(filter).sort({ createdAt: -1 });
//   const data = rawData.map((d) => ({
//     name: d.name,
//     email: d.email,
//     phone: d.phone,
//     message: d.message,
//     course: d.course,
//     createdAt: new Date(d.createdAt).toLocaleString(),
//   }));

//   const fields = [
//     "name",
//     "email",
//     "phone",
//     "message",
//     "course",
//     "createdAt",
//   ];
//   const parser = new Parser({ fields });
//   const csv = parser.parse(data);

//   return new NextResponse(csv, {
//     headers: {
//       "Content-Type": "text/csv",
//       "Content-Disposition": "attachment; filename=contacts.csv",
//     },
//   });
// }

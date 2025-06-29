import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Contact from "@/models/contact.model";
import { sendEmail } from "@/lib/sendEmail";
import { Parser } from "json2csv";

export async function POST(req: Request) {
  await dbConnect();
  const body = await req.json();
  const { name, email, phone, message, course } = body;

  // if (!name || !email || !phone) {
  //   return NextResponse.json(
  //     { error: "All fields are required" },
  //     { status: 400 }
  //   );
  // }
  try {
    const newContact = await Contact.create({
      name,
      email,
      phone,
      message,
      course,
    });

    await sendEmail({
      to: email,
      subject: "Thanks for contacting Brains & Brawns!",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <style>
              body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
              .container { max-width: 600px; margin: 0 auto; background: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05); }
              h1 { color: #2e3a59; }
              p { color: #333; font-size: 16px; line-height: 1.6; }
              .footer { margin-top: 40px; font-size: 13px; color: #999; text-align: center; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Hi ${name},</h1>
              <p>Thank you for contacting <strong>Brains & Brawns</strong>. We've received your message and our team will get back to you as soon as possible.</p>
              <p>We appreciate your interest and look forward to assisting you.</p>
              <p>Best regards,<br/>The Brains & Brawns Team</p>
              <div class="footer">&copy; 2025 Brains & Brawns. All rights reserved.</div>
            </div>
          </body>
        </html>
      `,
    });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error submitting contact form:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("name");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const isCSV = searchParams.get("export") === "csv";
    const regex = query ? new RegExp(query, "i") : null;

    const filter = regex
      ? {
          $or: [
            { name: { $regex: regex } },
            { email: { $regex: regex } },
            { phone: { $regex: regex } },
            { message: { $regex: regex } },
            { course: { $regex: regex } },
          ],
        }
      : {};
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      Contact.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Contact.countDocuments(filter),
    ]);

    if (isCSV) {
      const rawData = await Contact.find(filter).sort({ createdAt: -1 });
      const data = rawData.map((d) => ({
        name: d.name,
        email: d.email,
        phone: d.phone,
        message: d.message,
        course: d.course,
        createdAt: new Date(d.createdAt).toLocaleString(),
      }));

      const fields = [
        "name",
        "email",
        "phone",
        "message",
        "course",
        "createdAt",
      ];
      const parser = new Parser({ fields });
      const csv = parser.parse(data);

      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": "attachment; filename=contacts.csv",
        },
      });
    }

    return NextResponse.json({ data, total }, { status: 200 });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

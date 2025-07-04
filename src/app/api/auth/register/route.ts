import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { User } from "@/models/user";
import { hashPassword } from "@/lib/hash";

export async function POST(req: Request) {
  if (process.env.ALLOWREGISTER === "true") {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await dbConnect();

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    const hashed = await hashPassword(password);

    const newUser = new User({ email, password: hashed });
    await newUser.save();

    return NextResponse.json(
      { success: true, message: "User registered" },
      { status: 201 }
    );
  }
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}

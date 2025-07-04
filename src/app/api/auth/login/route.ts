import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { User } from "@/models/user";
import { comparePassword } from "@/lib/hash";
import { signToken } from "@/lib/jwt";
import { serialize } from "cookie";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
  }

  await dbConnect();

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  }

  const isValid = await comparePassword(password, user.password);
  if (!isValid) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  }

  const token = signToken({ email: user.email, id: user._id });

  const cookie = serialize("token", token, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  const res = NextResponse.json({ success: true, message: "Login successful" });
  res.headers.set("Set-Cookie", cookie);
  return res;
}

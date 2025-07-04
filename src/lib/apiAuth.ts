import { cookies } from "next/headers";
import { verifyToken } from "./jwt";
import { NextResponse } from "next/server";

export async function requireAuth(): Promise<
  { user: any } | { error: Response }
> {
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  try {
    const user = verifyToken(token);
    return { user };
  } catch (err) {
    return {
      error: NextResponse.json({ error: "Invalid token" }, { status: 403 }),
    };
  }
}

import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbConnect";
import Membership from "@/models/membership.model";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  const { method } = req;

  try {
    switch (method) {
      case "GET": {
        const memberships = await Membership.find().sort({ createdAt: -1 });
        return res.status(200).json(memberships);
      }

      case "POST": {
        const newMembership = await Membership.create(req.body);
        return res.status(201).json(newMembership);
      }

      case "PUT": {
        const { id } = req.query;
        if (!id) {
          return res.status(400).json({ error: "Missing membership ID" });
        }

        const updated = await Membership.findByIdAndUpdate(id, req.body, {
          new: true,
        });
        if (!updated) {
          return res.status(404).json({ error: "Membership not found" });
        }

        return res.status(200).json(updated);
      }

      case "DELETE": {
        const { id } = req.query;

        if (!id || typeof id !== "string") {
          return res.status(400).json({ error: "Invalid membership ID" });
        }

        const deleted = await Membership.findByIdAndDelete(id);
        if (!deleted) {
          return res.status(404).json({ error: "Membership not found" });
        }

        return res.status(200).json({ message: "Membership deleted" });
      }

      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        return res.status(405).json({ error: `Method ${method} Not Allowed` });
    }
  } catch (err: any) {
    return res
      .status(500)
      .json({ error: err.message || "Internal Server Error" });
  }
}

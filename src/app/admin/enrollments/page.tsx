"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import axios from "@/lib/axios";
import { toast } from "sonner";

type Subscription = {
  _id: string;
  sk: string;
  courseName: string;
  createdAt: string;
  studentInfo: {
    firstName: string;
    lastName: string;
    dob: string;
  };
  familyInfo: {
    name: string;
    email: string;
  };
};

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [selected, setSelected] = useState<Subscription | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchSubscriptions();
  }, []);
  const fetchSubscriptions = async () => {
    try {
      const res = await axios.get("/enrollment");
      setSubscriptions(res.data);
    } catch (err) {
      toast.error("Failed to fetch teachers");
    }
  };
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Subscriptions</h2>

      <Card className="overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">SK</th>
              <th className="p-3 text-left">Course</th>
              <th className="p-3 text-left">Student</th>
              <th className="p-3 text-left">Parent Email</th>
              <th className="p-3 text-left">Created At</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((sub) => (
              <tr key={sub._id} className="border-t">
                <td className="p-3">{sub.sk}</td>
                <td className="p-3">{sub.courseName}</td>
                <td className="p-3">
                  {sub.studentInfo.firstName} {sub.studentInfo.lastName}
                </td>
                <td className="p-3">{sub.familyInfo.email}</td>
                <td className="p-3">
                  {format(new Date(sub.createdAt), "dd MMM yyyy")}
                </td>
                <td className="p-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelected(sub);
                      setOpen(true);
                    }}
                  >
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Subscription Details</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold">Student Info</h4>
                <p>
                  Name: {selected.studentInfo.firstName}{" "}
                  {selected.studentInfo.lastName}
                </p>
                <p>DOB: {selected.studentInfo.dob}</p>
              </div>
              <div>
                <h4 className="font-semibold">Family Info</h4>
                <p>Name: {selected.familyInfo.name}</p>
                <p>Email: {selected.familyInfo.email}</p>
              </div>
              <div>
                <h4 className="font-semibold">Subscription Info</h4>
                <p>SK: {selected.sk}</p>
                <p>Course: {selected.courseName}</p>
                <p>
                  Created At:{" "}
                  {format(new Date(selected.createdAt), "dd MMM yyyy")}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

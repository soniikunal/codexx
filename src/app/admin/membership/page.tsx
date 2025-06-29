"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getMemberships,
  createMemberships,
  updateMemberships,
  deleteMemberships,
} from "@/services/MembershipService";
import { toast } from "sonner";
import { z } from "zod";

interface Membership {
  _id: string;
  billingPeriodMonth: string;
  cost: string;
  name: string;
  numberOfDaysInWeek: string;
  stripePriceId: string;
  type: string;
  unit: string;
}

const membershipSchema = z.object({
  billingPeriodMonth: z.string().min(1, "Billing Period Month is required"),
  cost: z.string().min(1, "Cost is required"),
  name: z.string().min(1, "Name is required"),
  numberOfDaysInWeek: z.string().min(1, "Number of Days is required"),
  stripePriceId: z.string().min(1, "Stripe Price ID is required"),
  type: z.string().min(1, "Type is required"),
  unit: z.string().min(1, "Unit is required"),
});

export default function MembershipManager() {
  type MembershipForm = z.infer<typeof membershipSchema>;

  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [formData, setFormData] = useState<MembershipForm>({
    billingPeriodMonth: "",
    cost: "",
    name: "",
    numberOfDaysInWeek: "",
    stripePriceId: "",
    type: "",
    unit: "$",
  });
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof MembershipForm, string>>
  >({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        const data = await getMemberships();
        setMemberships(data);
      } catch (err) {
        toast.error("Failed to load memberships");
      }
    };
    fetchMemberships();
  }, []);

  const handleChange = (field: keyof MembershipForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async () => {
    const result = membershipSchema.safeParse(formData);
    if (!result.success) {
      const errors: Partial<Record<keyof MembershipForm, string>> = {};
      result.error.errors.forEach((err) => {
        errors[err.path[0] as keyof MembershipForm] = err.message;
      });
      setFormErrors(errors);
      return;
    }

    try {
      if (editingId) {
        const updated = await updateMemberships(editingId, result.data);
        setMemberships((prev) =>
          prev.map((m) => (m._id === editingId ? updated : m))
        );
        toast.success("Membership updated");
      } else {
        const newMembership = await createMemberships(result.data);
        setMemberships((prev) => [...prev, newMembership]);
        toast.success("Membership created");
      }
      setModalOpen(false);
      setEditingId(null);
      resetForm();
    } catch {
      toast.error("Failed to save membership");
    }
  };

  const resetForm = () => {
    setFormData({
      billingPeriodMonth: "",
      cost: "",
      name: "",
      numberOfDaysInWeek: "",
      stripePriceId: "",
      type: "",
      unit: "$",
    });
    setFormErrors({});
  };

  const handleEdit = (id: string) => {
    const item = memberships.find((m) => m._id === id);
    if (item) {
      setFormData({ ...item });
      setEditingId(id);
      setModalOpen(true);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await deleteMemberships(deleteConfirmId);
      setMemberships((prev) => prev.filter((m) => m._id !== deleteConfirmId));
      toast.success("Deleted successfully");
    } catch {
      toast.error("Deletion failed");
    } finally {
      setDeleteConfirmId(null);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Manage Memberships</h2>
        <Button
          onClick={() => {
            setEditingId(null);
            resetForm();
            setModalOpen(true);
          }}
        >
          Add Membership
        </Button>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit" : "Add"} Membership</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {(
              [
                ["name", "Name"],
                ["cost", "Cost"],
                ["billingPeriodMonth", "Billing Period (Months)"],
                ["type", "Course Type"],
                // ["unit", "Unit"],
                ["stripePriceId", "Stripe Price ID"],
                ["numberOfDaysInWeek", "Number of Days/Week"],
              ] as [keyof MembershipForm, string][]
            ).map(([field, label]) => {
              return field == "cost" ||
                field == "numberOfDaysInWeek" ||
                field == "billingPeriodMonth" ? (
                <div key={field}>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    {label}
                  </label>
                  <Input
                    placeholder={label}
                    value={formData[field]}
                    type="number"
                    onChange={(e) => handleChange(field, e.target.value)}
                  />
                  {formErrors[field] && (
                    <p className="text-sm text-red-500 mt-1">
                      {formErrors[field]}
                    </p>
                  )}
                </div>
              ) : (
                <div key={field}>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    {label}
                  </label>
                  <Input
                    placeholder={label}
                    value={formData[field]}
                    onChange={(e) => handleChange(field, e.target.value)}
                  />
                  {formErrors[field] && (
                    <p className="text-sm text-red-500 mt-1">
                      {formErrors[field]}
                    </p>
                  )}
                </div>
              );
            })}
            <Button onClick={handleSubmit} className="w-full">
              {editingId ? "Save Changes" : "Add Membership"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!deleteConfirmId}
        onOpenChange={() => setDeleteConfirmId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Are you sure you want to delete this membership?</p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setDeleteConfirmId(null)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Billing Period</TableHead>
              <TableHead>Type</TableHead>
              {/* <TableHead>Unit</TableHead> */}
              <TableHead>Stripe ID</TableHead>
              <TableHead>Days/Week</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {memberships.map((m) => (
              <TableRow key={m._id}>
                <TableCell>{m.name}</TableCell>
                <TableCell>{m.cost}</TableCell>
                <TableCell>{m.billingPeriodMonth}</TableCell>
                <TableCell>{m.type}</TableCell>
                {/* <TableCell>{m.unit}</TableCell> */}
                <TableCell>{m.stripePriceId}</TableCell>
                <TableCell>{m.numberOfDaysInWeek}</TableCell>
                <TableCell className="px-6 py-4 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(m._id)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => setDeleteConfirmId(m._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

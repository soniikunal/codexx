"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";
import axios from "@/lib/axios";
import { toast } from "sonner";
import { z } from "zod";

interface Testimonial {
  name: string;
  rating: string;
  testimonial: string;
  _id: string;
}

export default function ParentTestimonialsManager() {
  const testimonialSchema = z.object({
    name: z.string().min(1, "Name is required"),
    rating: z.string().refine((val) => /^[1-5]$/.test(val), {
      message: "Rating must be a number between 1 and 5",
    }),
    testimonial: z.string().min(1, "Testimonial is required"),
  });
  type TestimonialForm = z.infer<typeof testimonialSchema>;
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [form, setForm] = useState<TestimonialForm>({
    name: "",
    rating: "",
    testimonial: "",
  });

  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof TestimonialForm, string>>
  >({});

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await axios.get("/testimonials");
      setTestimonials(res.data);
    } catch (err) {
      toast.error("Failed to load testimonials");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const result = testimonialSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof TestimonialForm, string>> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof TestimonialForm;
        fieldErrors[field] = err.message;
      });
      setFormErrors(fieldErrors);
      toast.error("Please fix form errors");
      return;
    }

    try {
      if (editIndex !== null) {
        const id = testimonials[editIndex]._id;
        await axios.put(`/testimonials/${id}`, form);
        toast.success("Testimonial updated");
      } else {
        await axios.post("/testimonials", form);
        toast.success("Testimonial added");
      }
      fetchTestimonials();
      setModalOpen(false);
      resetForm();
      setFormErrors({});
    } catch (err) {
      toast.error("Error saving testimonial");
    }
  };

  const handleEdit = (index: number) => {
    setForm(testimonials[index]);
    setEditIndex(index);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      if (!deleteConfirmId) return;
      await axios.delete(`/testimonials/${deleteConfirmId}`);
      toast.success("Testimonial deleted");
      fetchTestimonials();
      setDeleteModalOpen(false);
    } catch (err) {
      toast.error("Failed to delete testimonial");
    }
  };

  const resetForm = () => {
    setForm({ name: "", rating: "", testimonial: "" });
    setEditIndex(null);
    setFormErrors({});
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Parent Testimonials</h2>
        <Button onClick={() => setModalOpen(true)}>Add Testimonial</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Testimonial</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {testimonials.map((testimonial, index) => (
            <TableRow key={index}>
              <TableCell>{testimonial.name}</TableCell>
              <TableCell>{testimonial.rating}</TableCell>
              <TableCell>{testimonial.testimonial}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(index)}
                  >
                    <Pencil size={16} />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      setDeleteConfirmId(testimonial._id);
                      setDeleteModalOpen(true);
                    }}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modal for Add/Edit */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editIndex !== null ? "Edit Testimonial" : "Add Testimonial"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full Name"
                required
              />
              {formErrors.name && (
                <p className="text-sm text-red-500">{formErrors.name}</p>
              )}
            </div>

            <div>
              <Input
                name="rating"
                value={form.rating}
                onChange={(e) => {
                  setForm({ ...form, rating: e.target.value });
                  setFormErrors((prev) => ({ ...prev, rating: undefined }));
                }}
                placeholder="Rating (1-5)"
                required
              />
              {formErrors.rating && (
                <p className="text-sm text-red-500">{formErrors.rating}</p>
              )}
            </div>

            <div>
              <Textarea
                name="testimonial"
                value={form.testimonial}
                onChange={handleChange}
                placeholder="Testimonial"
                required
              />
              {formErrors.testimonial && (
                <p className="text-sm text-red-500">{formErrors.testimonial}</p>
              )}
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button onClick={handleSubmit}>
              {editIndex !== null ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal for Delete Confirmation */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this testimonial?</p>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

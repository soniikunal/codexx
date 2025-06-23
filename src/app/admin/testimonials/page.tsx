"use client";
import React, { useState } from "react";
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

interface Testimonial {
  name: string;
  rating: string;
  testimonial: string;
}

export default function ParentTestimonialsManager() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [form, setForm] = useState<Testimonial>({
    name: "",
    rating: "",
    testimonial: "",
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (editIndex !== null) {
      const updated = [...testimonials];
      updated[editIndex] = form;
      setTestimonials(updated);
    } else {
      setTestimonials([...testimonials, form]);
    }
    setModalOpen(false);
    resetForm();
  };

  const handleEdit = (index: number) => {
    setForm(testimonials[index]);
    setEditIndex(index);
    setModalOpen(true);
  };

  const handleDelete = () => {
    if (editIndex !== null) {
      const updated = testimonials.filter((_, i) => i !== editIndex);
      setTestimonials(updated);
      setDeleteModalOpen(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setForm({ name: "", rating: "", testimonial: "" });
    setEditIndex(null);
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
                      setEditIndex(index);
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
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name"
              required
            />
            <Input
              name="rating"
              value={form.rating}
              onChange={handleChange}
              placeholder="Rating (1-5)"
              required
            />
            <Textarea
              name="testimonial"
              value={form.testimonial}
              onChange={handleChange}
              placeholder="Testimonial"
              required
            />
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

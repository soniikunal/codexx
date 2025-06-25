"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import api from "@/lib/axios";

interface Teacher {
  _id?: string;
  name: string;
  profile_url: string;
  address: string;
  educationalDetail: string;
  description: string;
}

export default function TeacherManager() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [modalTeacher, setModalTeacher] = useState<Teacher | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const res = await api.get("/teacher");
      setTeachers(res.data);
    } catch (err) {
      toast.error("Failed to fetch teachers");
    }
  };

  const handleSave = async () => {
    if (!modalTeacher) return;

    try {
      if (editingId) {
        const res = await api.put(`/teacher/${editingId}`, modalTeacher);
        toast.success("Teacher updated");
      } else {
        const res = await api.post("/teacher", modalTeacher);
        toast.success("Teacher added");
      }
      setModalTeacher(null);
      setEditingId(null);
      fetchTeachers();
    } catch (err) {
      toast.error("Operation failed");
    }
  };

  const handleDelete = async () => {
    if (!confirmDeleteId) return;

    try {
      await api.delete(`/teacher/${confirmDeleteId}`);
      toast.success("Teacher deleted");
      setConfirmDeleteId(null);
      fetchTeachers();
    } catch (err) {
      toast.error("Failed to delete teacher");
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Manage Teachers</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setModalTeacher({
                  name: "",
                  profile_url: "",
                  address: "",
                  educationalDetail: "",
                  description: "",
                });
                setEditingId(null);
              }}
            >
              Add Teacher
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Edit Teacher" : "Add Teacher"}
              </DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <Input
                placeholder="Name"
                value={modalTeacher?.name || ""}
                onChange={(e) =>
                  setModalTeacher({ ...modalTeacher!, name: e.target.value })
                }
              />
              <Input
                placeholder="Profile Image URL"
                value={modalTeacher?.profile_url || ""}
                onChange={(e) =>
                  setModalTeacher({
                    ...modalTeacher!,
                    profile_url: e.target.value,
                  })
                }
              />
              <Input
                placeholder="Address"
                value={modalTeacher?.address || ""}
                onChange={(e) =>
                  setModalTeacher({
                    ...modalTeacher!,
                    address: e.target.value,
                  })
                }
              />
              <Input
                placeholder="Educational Detail"
                value={modalTeacher?.educationalDetail || ""}
                onChange={(e) =>
                  setModalTeacher({
                    ...modalTeacher!,
                    educationalDetail: e.target.value,
                  })
                }
              />
              <Textarea
                placeholder="Description"
                value={modalTeacher?.description || ""}
                onChange={(e) =>
                  setModalTeacher({
                    ...modalTeacher!,
                    description: e.target.value,
                  })
                }
              />
              <Button type="button" onClick={handleSave}>
                Save
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Profile</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Education</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teachers.map((teacher) => (
              <TableRow key={teacher._id}>
                <TableCell>{teacher.name}</TableCell>
                <TableCell>
                  <img
                    src={teacher.profile_url}
                    alt={teacher.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </TableCell>
                <TableCell>{teacher.address}</TableCell>
                <TableCell>{teacher.educationalDetail}</TableCell>
                <TableCell className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setModalTeacher(teacher);
                      setEditingId(teacher._id || null);
                    }}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => setConfirmDeleteId(teacher._id || null)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation */}
      <Dialog
        open={confirmDeleteId !== null}
        onOpenChange={() => setConfirmDeleteId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this teacher?</p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setConfirmDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

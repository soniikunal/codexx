"use client";

import { useEffect, useRef, useState } from "react";
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
import axios from "@/lib/axios";
import { toast } from "sonner";
import AddTeacherForm from "@/components/AddTeacherForm";

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
  const [file, setFile] = useState<File | null>(null);
  const [modalTeacher, setModalTeacher] = useState<
    Omit<Teacher, "profile_url">
  >({
    name: "kunal",
    address: "UDR",
    educationalDetail: "BCA",
    description: "GOODD TEACHER!",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchTeachers = async () => {
    try {
      const res = await axios.get("/teacher");
      setTeachers(res.data);
    } catch (err) {
      toast.error("Failed to fetch teachers");
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file first!");
      return;
    }
    const formData = new FormData();
    formData.append("name", modalTeacher.name);
    formData.append("address", modalTeacher.address);
    formData.append("educationalDetail", modalTeacher.educationalDetail);
    formData.append("description", modalTeacher.description);
    if (file) {
      formData.append("photo", file);
    }
    try {
      if (editingId) {
        const res = await axios.put(`/teacher/${editingId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        // setTeachers((prev) =>
        //   prev.map((t) => (t._id === editingId ? res.data : t))
        // );
        toast.success("Teacher updated");
      } else {
        const res = await axios.post("/teacher", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        // setTeachers((prev) => [...prev, res.data]);
        toast.success("Teacher added");
      }
    } catch (err) {
      toast.error("Failed to save teacher");
    } finally {
      resetModal();
      fetchTeachers();
    }
  };

  const handleDelete = async () => {
    if (!confirmDeleteId) return;
    try {
      await axios.delete(`/teacher/${confirmDeleteId}`);
      // setTeachers((prev) => prev.filter((t) => t._id !== confirmDeleteId));
      toast.success("Teacher deleted");
    } catch (err) {
      toast.error("Failed to delete teacher");
    } finally {
      setConfirmDeleteId(null);
      fetchTeachers();
    }
  };

  const resetModal = () => {
    setModalTeacher({
      name: "",
      address: "",
      educationalDetail: "",
      description: "",
    });
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setEditingId(null);
    setModalOpen(false);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Manage Teachers</h1>
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                resetModal();
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
            <form className="space-y-4" encType="multipart/form-data">
              <Input
                placeholder="Name"
                value={modalTeacher.name}
                onChange={(e) =>
                  setModalTeacher({ ...modalTeacher, name: e.target.value })
                }
              />
              <Input
                placeholder="Address"
                value={modalTeacher.address}
                onChange={(e) =>
                  setModalTeacher({ ...modalTeacher, address: e.target.value })
                }
              />
              <Input
                placeholder="Educational Detail"
                value={modalTeacher.educationalDetail}
                onChange={(e) =>
                  setModalTeacher({
                    ...modalTeacher,
                    educationalDetail: e.target.value,
                  })
                }
              />
              <Textarea
                placeholder="Description"
                value={modalTeacher.description}
                onChange={(e) =>
                  setModalTeacher({
                    ...modalTeacher,
                    description: e.target.value,
                  })
                }
              />
              <input
                type="file"
                name="photo"
                className="block"
                onChange={(e) => {
                  const selected = e.target.files?.[0];
                  if (selected) setFile(selected);
                }}
              />
              <Button type="button" onClick={handleSave}>
                {editingId ? "Update" : "Save"}
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
                    size="icon"
                    variant="outline"
                    onClick={() => {
                      setModalTeacher({
                        name: teacher.name,
                        address: teacher.address,
                        educationalDetail: teacher.educationalDetail,
                        description: teacher.description,
                      });
                      setEditingId(teacher._id!);
                      setModalOpen(true);
                    }}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => setConfirmDeleteId(teacher._id!)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={!!confirmDeleteId}
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

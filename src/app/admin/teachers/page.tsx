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

  const handleSave = async () => {
    debugger;
    const formData = new FormData();
    formData.append("name", modalTeacher.name);
    formData.append("address", modalTeacher.address);
    formData.append("educationalDetail", modalTeacher.educationalDetail);
    formData.append("description", modalTeacher.description);
    if (fileInputRef.current?.files?.[0]) {
      formData.append("photo", fileInputRef.current.files[0]);
    }

    try {
      if (editingId) {
        // Update - optional in future
      } else {
        const res = await axios.post("/teacher", formData);
        setTeachers((prev) => [...prev, res.data]);
        toast.success("Teacher added");
      }
    } catch (err) {
      toast.error("Failed to save teacher");
    } finally {
      resetModal();
    }
  };

  const handleDelete = async () => {
    if (!confirmDeleteId) return;
    try {
      await axios.delete(`/teacher/${confirmDeleteId}`);
      setTeachers((prev) => prev.filter((t) => t._id !== confirmDeleteId));
      toast.success("Teacher deleted");
    } catch (err) {
      toast.error("Failed to delete teacher");
    } finally {
      setConfirmDeleteId(null);
    }
  };

  const resetModal = () => {
    setModalTeacher({
      name: "",
      address: "",
      educationalDetail: "",
      description: "",
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
    setEditingId(null);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Manage Teachers</h1>
        <Dialog>
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
              <DialogTitle>Add Teacher</DialogTitle>
            </DialogHeader>
            <AddTeacherForm
              onAdd={(teacher) => {
                setTeachers((prev) => [...prev, teacher]);
                toast.success("Teacher added");
              }}
            />
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
                  {/* You can enable editing later */}
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

      {/* Delete Confirmation */}
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

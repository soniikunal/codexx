"use client";

import { useState } from "react";
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

interface Teacher {
  name: string;
  profile_url: string;
  address: string;
  educationalDetail: string;
  description: string;
}

export default function TeacherManager() {
  const [teachers, setTeachers] = useState<Teacher[]>([
    {
      name: "Subrata Chandra",
      profile_url: "https://codex-new.s3.amazonaws.com/Subrata.jpg",
      address: "address",
      educationalDetail: "Phd, Chemistry",
      description: "",
    },
  ]);

  const [modalTeacher, setModalTeacher] = useState<Teacher | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState<number | null>(
    null
  );

  const handleSave = () => {
    if (modalTeacher) {
      if (editingIndex !== null) {
        const updated = [...teachers];
        updated[editingIndex] = modalTeacher;
        setTeachers(updated);
      } else {
        setTeachers([...teachers, modalTeacher]);
      }
    }
    setModalTeacher(null);
    setEditingIndex(null);
  };

  const handleDelete = () => {
    if (confirmDeleteIndex !== null) {
      setTeachers(teachers.filter((_, i) => i !== confirmDeleteIndex));
      setConfirmDeleteIndex(null);
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
                setEditingIndex(null);
              }}
            >
              Add Teacher
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingIndex !== null ? "Edit Teacher" : "Add Teacher"}
              </DialogTitle>
            </DialogHeader>
            <form className="space-y-4">
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
                  setModalTeacher({ ...modalTeacher!, address: e.target.value })
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
            {teachers.map((teacher, index) => (
              <TableRow key={index} className="border-b">
                <TableCell className="p-2 font-medium">
                  {teacher.name}
                </TableCell>
                <TableCell>
                  <img
                    src={teacher.profile_url}
                    alt={teacher.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </TableCell>
                <TableCell>{teacher.address}</TableCell>
                <TableCell>{teacher.educationalDetail}</TableCell>
                <TableCell className="p-2 flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setEditingIndex(index);
                      setModalTeacher(teacher);
                    }}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => setConfirmDeleteIndex(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={confirmDeleteIndex !== null}
        onOpenChange={() => setConfirmDeleteIndex(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete TableHeadis teacher?</p>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setConfirmDeleteIndex(null)}
            >
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

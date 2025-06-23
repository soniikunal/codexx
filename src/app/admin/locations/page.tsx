"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
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

interface Location {
  id: string;
  address: string;
  fullName: string;
  shortName: string;
}

export default function LocationManager() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [newLocation, setNewLocation] = useState({
    address: "",
    fullName: "",
    shortName: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleAdd = () => {
    setLocations((prev) => [
      ...prev,
      { ...newLocation, id: Date.now().toString() },
    ]);
    setNewLocation({ address: "", fullName: "", shortName: "" });
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (deleteConfirmId) {
      setLocations((prev) => prev.filter((loc) => loc.id !== deleteConfirmId));
      setDeleteConfirmId(null);
    }
  };

  const handleEdit = (id: string) => {
    const loc = locations.find((l) => l.id === id);
    if (loc) {
      setNewLocation({ ...loc });
      setEditingId(id);
      setModalOpen(true);
    }
  };

  const handleSave = () => {
    setLocations((prev) =>
      prev.map((loc) =>
        loc.id === editingId ? { ...loc, ...newLocation } : loc
      )
    );
    setNewLocation({ address: "", fullName: "", shortName: "" });
    setEditingId(null);
    setModalOpen(false);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Manage Locations</h2>
        <Button
          onClick={() => {
            setEditingId(null);
            setNewLocation({ address: "", fullName: "", shortName: "" });
            setModalOpen(true);
          }}
        >
          Add Location
        </Button>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Location" : "Add Location"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Full Name"
              value={newLocation.fullName}
              onChange={(e) =>
                setNewLocation({ ...newLocation, fullName: e.target.value })
              }
            />
            <Input
              placeholder="Short Name"
              value={newLocation.shortName}
              onChange={(e) =>
                setNewLocation({ ...newLocation, shortName: e.target.value })
              }
            />
            <Input
              placeholder="Address"
              value={newLocation.address}
              onChange={(e) =>
                setNewLocation({ ...newLocation, address: e.target.value })
              }
            />
            <Button
              onClick={editingId ? handleSave : handleAdd}
              className="w-full"
            >
              {editingId ? "Save Changes" : "Add Location"}
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
            <p>Are you sure you want to delete this location?</p>
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

      <div className="overflow-x-auto border rounded-lg mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Full Name</TableHead>
              <TableHead>Short Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {locations.map((loc) => (
              <TableRow key={loc.id}>
                <TableCell>{loc.fullName}</TableCell>
                <TableCell>{loc.shortName}</TableCell>
                <TableCell>{loc.address}</TableCell>
                <TableCell className="px-6 py-4 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(loc.id)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => setDeleteConfirmId(loc.id)}
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

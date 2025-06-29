"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import AddProgramDialog from "@/components/AddProgramDialog";
import { toast } from "sonner";
import axios from "@/lib/axios";

const PK_OPTIONS = ["PROG_SCIENCE", "PROG_MATH", "PROG_CODING"];

interface LocationEntry {
  name: string;
  startDate: string;
  endDate: string;
  instructor: string;
}

interface ScheduleEntry {
  id: string;
  from: string;
  to: string;
}

interface Schedule {
  [key: string]: ScheduleEntry[];
}

interface Program {
  _id?: string;
  pk: string;
  courseName: string;
  ageRange: string;
  description: string;
  headerTitle: string;
  thumbnailImage: string;
  location: LocationEntry[];
  schedule: Schedule;
  program: string;
  status: string;
  maxEnrollment: string;
  startDate: string;
  endDate: string;
  inPerson: Boolean;
  remote: Boolean;
}

export default function ProgramManager() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [modalProgram, setModalProgram] = useState<Program | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState<number | null>(
    null
  );
  const [file, setFile] = useState<File | null>(null);

  const fetchPrograms = async () => {
    try {
      const res = await axios.get("/program");
      setPrograms(res.data);
    } catch (err) {
      toast.error("Failed to fetch Courses");
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalProgram) return;
    if (!file) {
      alert("Please select a thumbnail image!");
      return;
    }

    const formData = new FormData();
    formData.append("pk", modalProgram.pk);
    formData.append("courseName", modalProgram.courseName);
    formData.append("ageRange", modalProgram.ageRange);
    formData.append("description", modalProgram.description);
    formData.append("headerTitle", modalProgram.headerTitle);
    formData.append("program", modalProgram.program);
    formData.append("status", modalProgram.status);
    formData.append("inPerson", JSON.stringify(modalProgram.inPerson));
    formData.append("remote", JSON.stringify(modalProgram.remote));
    formData.append("maxEnrollment", modalProgram.maxEnrollment);
    formData.append(
      "startDate",
      new Date(modalProgram.startDate).toISOString()
    );
    formData.append("endDate", new Date(modalProgram.endDate).toISOString());
    formData.append("photo", file); // attach actual File object

    // Stringify location and schedule arrays/objects
    formData.append("location", JSON.stringify(modalProgram.location));
    formData.append("schedule", JSON.stringify(modalProgram.schedule));

    try {
      if (editingIndex !== null) {
        // Update existing program
        await axios.put(`/program/?id=${modalProgram._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Program updated");
      } else {
        // Add new program
        await axios.post("/program", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Program added");
      }
      fetchPrograms();
      setModalProgram(null);
      setEditingIndex(null);
      setFile(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save program");
    }
  };

  const handleDelete = async () => {
    if (confirmDeleteIndex === null) return;

    const programToDelete = programs[confirmDeleteIndex];
    const id = programToDelete._id;

    try {
      await axios.delete(`/program?id=${id}`);
      toast.success("Program deleted");
      fetchPrograms();
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete program");
    } finally {
      setConfirmDeleteIndex(null);
    }
  };

  const initializeProgram = (): Program => ({
    pk: "PROG_CODING",
    courseName: "",
    ageRange: "",
    description: "",
    headerTitle: "",
    thumbnailImage: "",
    location: [],
    schedule: {
      MON: [],
      TUE: [],
      WED: [],
      THU: [],
      FRI: [],
      SAT: [],
      SUN: [],
    },
    program: "",
    status: "Active",
    maxEnrollment: "",
    startDate: "",
    endDate: "",
    inPerson: true,
    remote: true,
  });

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Manage Programs</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setModalProgram(initializeProgram());
                setEditingIndex(null);
              }}
            >
              Add Program
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>
      <AddProgramDialog
        modalProgram={modalProgram}
        setModalProgram={setModalProgram}
        onSave={handleSave}
        setFile={setFile}
        editingIndex={editingIndex}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Course</TableHead>
             <TableHead>Thumbnail</TableHead>
            <TableHead>Age Range</TableHead>
            <TableHead>Program</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {programs.map((program, index) => (
            <TableRow key={index}>
              <TableCell>{program.courseName}</TableCell>
              <TableCell>
                  <img
                    src={program.thumbnailImage}
                    alt={program.courseName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </TableCell>
              <TableCell>{program.ageRange}</TableCell>
              <TableCell>{program.program}</TableCell>
              <TableCell className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setModalProgram(program);
                    setEditingIndex(index);
                  }}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => setConfirmDeleteIndex(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Delete Dialog */}
      <Dialog
        open={confirmDeleteIndex !== null}
        onOpenChange={() => setConfirmDeleteIndex(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this program?</p>
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
// <DialogContent className="w-full max-w-[calc(100%-2rem)] sm:max-w-2xl md:max-w-4xl lg:max-w-5xl">
//         <DialogHeader>
//           <DialogTitle>
//             {editingIndex !== null ? "Edit Program" : "Add Program"}
//           </DialogTitle>
//         </DialogHeader>

//         {modalProgram && (
//           <div className="grid grid-cols-2 gap-4 mt-4 max-h-[70vh] overflow-y-auto">
//             {/* Program Metadata */}
//             <div className="space-y-2">
//               <Label>Program Type (pk)</Label>
//               <select
//                 value={modalProgram.pk}
//                 onChange={(e) =>
//                   setModalProgram({ ...modalProgram, pk: e.target.value })
//                 }
//                 className="border rounded px-3 py-2 text-xs w-full"
//               >
//                 {PK_OPTIONS.map((option) => (
//                   <option key={option}>{option}</option>
//                 ))}
//               </select>
//             </div>

//             <div className="space-y-2">
//               <Label>Course Name</Label>
//               <Input
//                 value={modalProgram.courseName}
//                 onChange={(e) =>
//                   setModalProgram({
//                     ...modalProgram,
//                     courseName: e.target.value,
//                   })
//                 }
//               />
//             </div>

//             <div className="space-y-2">
//               <Label>Age Range</Label>
//               <Input
//                 value={modalProgram.ageRange}
//                 onChange={(e) =>
//                   setModalProgram({
//                     ...modalProgram,
//                     ageRange: e.target.value,
//                   })
//                 }
//               />
//             </div>

//             <div className="space-y-2">
//               <Label>Header Title</Label>
//               <Input
//                 value={modalProgram.headerTitle}
//                 onChange={(e) =>
//                   setModalProgram({
//                     ...modalProgram,
//                     headerTitle: e.target.value,
//                   })
//                 }
//               />
//             </div>

//             <div className="space-y-2">
//               <Label>Max Enrollment</Label>
//               <Input
//                 type="number"
//                 value={modalProgram.maxEnrollment}
//                 onChange={(e) =>
//                   setModalProgram({
//                     ...modalProgram,
//                     maxEnrollment: e.target.value,
//                   })
//                 }
//               />
//             </div>

//             <div className="space-y-2">
//               <Label>Start Date</Label>
//               <Input
//                 type="date"
//                 value={modalProgram.startDate}
//                 onChange={(e) =>
//                   setModalProgram({
//                     ...modalProgram,
//                     startDate: e.target.value,
//                   })
//                 }
//               />
//             </div>

//             <div className="space-y-2">
//               <Label>End Date</Label>
//               <Input
//                 type="date"
//                 value={modalProgram.endDate}
//                 onChange={(e) =>
//                   setModalProgram({
//                     ...modalProgram,
//                     endDate: e.target.value,
//                   })
//                 }
//               />
//             </div>

//             <div className="space-y-2">
//               <Label>Program</Label>
//               <Input
//                 value={modalProgram.program}
//                 onChange={(e) =>
//                   setModalProgram({
//                     ...modalProgram,
//                     program: e.target.value,
//                   })
//                 }
//               />
//             </div>

//             {/* Radio Button for Status */}
//             <div className="space-y-2">
//               <Label>Status</Label>
//               <div className="flex items-center gap-4">
//                 <label className="flex items-center gap-2">
//                   <input
//                     type="radio"
//                     value="Active"
//                     checked={modalProgram.status === "Active"}
//                     onChange={(e) =>
//                       setModalProgram({
//                         ...modalProgram,
//                         status: e.target.value,
//                       })
//                     }
//                   />
//                   Active
//                 </label>
//                 <label className="flex items-center gap-2">
//                   <input
//                     type="radio"
//                     value="Inactive"
//                     checked={modalProgram.status === "Inactive"}
//                     onChange={(e) =>
//                       setModalProgram({
//                         ...modalProgram,
//                         status: e.target.value,
//                       })
//                     }
//                   />
//                   Inactive
//                 </label>
//               </div>
//             </div>

//             {/* Boolean Fields */}
//             <div className="space-y-2">
//               <Label>In Person (Y/N)</Label>
//               <div className="flex items-center gap-4">
//                 <label className="flex items-center gap-2">
//                   <input
//                     type="radio"
//                     value="true"
//                     checked={modalProgram.inPerson === "true"}
//                     onChange={(e) =>
//                       setModalProgram({
//                         ...modalProgram,
//                         inPerson: e.target.value,
//                       })
//                     }
//                   />
//                   Y
//                 </label>
//                 <label className="flex items-center gap-2">
//                   <input
//                     type="radio"
//                     value="false"
//                     checked={modalProgram.inPerson === "false"}
//                     onChange={(e) =>
//                       setModalProgram({
//                         ...modalProgram,
//                         inPerson: e.target.value,
//                       })
//                     }
//                   />
//                   N
//                 </label>
//               </div>
//             </div>
//             <div className="space-y-2">
//               <Label>Remote (Y/N)</Label>
//               <div className="flex items-center gap-4">
//                 <label className="flex items-center gap-2">
//                   <input
//                     type="radio"
//                     value="true"
//                     checked={modalProgram.remote === "true"}
//                     onChange={(e) =>
//                       setModalProgram({
//                         ...modalProgram,
//                         remote: e.target.value,
//                       })
//                     }
//                   />
//                   Y
//                 </label>
//                 <label className="flex items-center gap-2">
//                   <input
//                     type="radio"
//                     value="false"
//                     checked={modalProgram.remote === "false"}
//                     onChange={(e) =>
//                       setModalProgram({
//                         ...modalProgram,
//                         remote: e.target.value,
//                       })
//                     }
//                   />
//                   N
//                 </label>
//               </div>
//             </div>

//             <div className="space-y-2 col-span-2">
//               <Label>Description</Label>
//               <Textarea
//                 value={modalProgram.description}
//                 onChange={(e) =>
//                   setModalProgram({
//                     ...modalProgram,
//                     description: e.target.value,
//                   })
//                 }
//               />
//             </div>

//             <div className="space-y-2">
//               <Label>Thumbnail Image URL</Label>
//               <Input
//                 value={modalProgram.thumbnailImage}
//                 onChange={(e) =>
//                   setModalProgram({
//                     ...modalProgram,
//                     thumbnailImage: e.target.value,
//                   })
//                 }
//               />
//             </div>

//             {/* Location Fieldset */}
//             <div className="col-span-2 space-y-4">
//               <Label className="font-semibold">Locations</Label>
//               {modalProgram.location.map((loc, idx) => (
//                 <div key={idx} className="grid grid-cols-4 gap-2">
//                   <div className="space-y-1">
//                     <Label>Name</Label>
//                     <Input
//                       value={loc.name}
//                       onChange={(e) => {
//                         const updated = [...modalProgram.location];
//                         updated[idx].name = e.target.value;
//                         setModalProgram({
//                           ...modalProgram,
//                           location: updated,
//                         });
//                       }}
//                     />
//                   </div>
//                   <div className="space-y-1">
//                     <Label>Start Date</Label>
//                     <Input
//                       type="date"
//                       value={loc.startDate}
//                       onChange={(e) => {
//                         const updated = [...modalProgram.location];
//                         updated[idx].startDate = e.target.value;
//                         setModalProgram({
//                           ...modalProgram,
//                           location: updated,
//                         });
//                       }}
//                     />
//                   </div>
//                   <div className="space-y-1">
//                     <Label>End Date</Label>
//                     <Input
//                       type="date"
//                       value={loc.endDate}
//                       onChange={(e) => {
//                         const updated = [...modalProgram.location];
//                         updated[idx].endDate = e.target.value;
//                         setModalProgram({
//                           ...modalProgram,
//                           location: updated,
//                         });
//                       }}
//                     />
//                   </div>
//                   <div className="space-y-1">
//                     <Label>Instructor</Label>
//                     <Input
//                       value={loc.instructor}
//                       onChange={(e) => {
//                         const updated = [...modalProgram.location];
//                         updated[idx].instructor = e.target.value;
//                         setModalProgram({
//                           ...modalProgram,
//                           location: updated,
//                         });
//                       }}
//                     />
//                   </div>
//                 </div>
//               ))}
//               <Button
//                 variant="outline"
//                 onClick={() =>
//                   setModalProgram({
//                     ...modalProgram,
//                     location: [
//                       ...modalProgram.location,
//                       {
//                         name: "",
//                         startDate: "",
//                         endDate: "",
//                         instructor: "",
//                       },
//                     ],
//                   })
//                 }
//               >
//                 Add Location
//               </Button>
//             </div>

//             {/* Schedule Fieldset */}
//             <div className="col-span-2 space-y-4">
//               <Label className="font-semibold">Schedule</Label>
//               {Object.entries(modalProgram.schedule).map(([day, slots]) => (
//                 <div key={day} className="mb-3">
//                   <Label className="mb-3">{day}</Label>
//                   {slots.map((slot, idx) => (
//                     <div key={idx} className="grid grid-cols-3 gap-2 mb-2">
//                       <div className="space-y-1">
//                         <Label>ID</Label>
//                         <Input value={slot.id} readOnly disabled />
//                       </div>
//                       <div className="space-y-1">
//                         <Label>From</Label>
//                         <Input
//                           type="time"
//                           value={slot.from}
//                           onChange={(e) => {
//                             const updated = { ...modalProgram.schedule };
//                             updated[day][idx].from = e.target.value;
//                             setModalProgram({
//                               ...modalProgram,
//                               schedule: updated,
//                             });
//                           }}
//                         />
//                       </div>
//                       <div className="space-y-1">
//                         <Label>To</Label>
//                         <Input
//                           type="time"
//                           value={slot.to}
//                           onChange={(e) => {
//                             const updated = { ...modalProgram.schedule };
//                             updated[day][idx].to = e.target.value;
//                             setModalProgram({
//                               ...modalProgram,
//                               schedule: updated,
//                             });
//                           }}
//                         />
//                       </div>
//                     </div>
//                   ))}
//                   <Button
//                     size="sm"
//                     variant="outline"
//                     onClick={() => {
//                       const updated = { ...modalProgram.schedule };
//                       updated[day].push({
//                         id: Math.random().toString(36).substr(2, 8),
//                         from: "",
//                         to: "",
//                       });
//                       setModalProgram({
//                         ...modalProgram,
//                         schedule: updated,
//                       });
//                     }}
//                   >
//                     Add {day} Slot
//                   </Button>
//                 </div>
//               ))}
//             </div>

//             <div className="col-span-2">
//               <Button className="w-full" onClick={handleSave}>
//                 Save Program
//               </Button>
//             </div>
//           </div>
//         )}
//       </DialogContent>

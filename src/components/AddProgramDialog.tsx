"use client";

import { Dispatch, SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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

export interface Program {
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
  inPerson: string;
  remote: string;
}

interface AddProgramDialogProps {
  modalProgram: Program | null;
  setModalProgram: Dispatch<SetStateAction<Program | null>>;
  onSave: () => void;
  // triggerButton: React.ReactNode;
}

export default function AddProgramDialog({
  modalProgram,
  setModalProgram,
  onSave,
  // triggerButton,
}: AddProgramDialogProps) {
  return (
    <Dialog open={!!modalProgram} onOpenChange={() => setModalProgram(null)}>
      {/* <DialogTrigger asChild>{triggerButton}</DialogTrigger> */}
      <DialogContent className="w-full max-w-5xl">
        <DialogHeader>
          <DialogTitle>
            {modalProgram ? "Add Program" : "Edit Program"}
          </DialogTitle>
        </DialogHeader>

        {modalProgram && (
          <div className="grid grid-cols-2 gap-4 mt-4 max-h-[70vh] overflow-y-auto">
            {/* Program Metadata */}
            <div className="space-y-2">
              <Label>Program Type (pk)</Label>
              <select
                value={modalProgram.pk}
                onChange={(e) =>
                  setModalProgram({ ...modalProgram, pk: e.target.value })
                }
                className="border rounded px-3 py-2 text-xs w-full"
              >
                {PK_OPTIONS.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label>Course Name</Label>
              <Input
                value={modalProgram.courseName}
                onChange={(e) =>
                  setModalProgram({
                    ...modalProgram,
                    courseName: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Age Range</Label>
              <Input
                value={modalProgram.ageRange}
                onChange={(e) =>
                  setModalProgram({
                    ...modalProgram,
                    ageRange: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Header Title</Label>
              <Input
                value={modalProgram.headerTitle}
                onChange={(e) =>
                  setModalProgram({
                    ...modalProgram,
                    headerTitle: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Max Enrollment</Label>
              <Input
                type="number"
                value={modalProgram.maxEnrollment}
                onChange={(e) =>
                  setModalProgram({
                    ...modalProgram,
                    maxEnrollment: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input
                type="date"
                value={modalProgram.startDate}
                onChange={(e) =>
                  setModalProgram({
                    ...modalProgram,
                    startDate: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>End Date</Label>
              <Input
                type="date"
                value={modalProgram.endDate}
                onChange={(e) =>
                  setModalProgram({
                    ...modalProgram,
                    endDate: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Program</Label>
              <Input
                value={modalProgram.program}
                onChange={(e) =>
                  setModalProgram({
                    ...modalProgram,
                    program: e.target.value,
                  })
                }
              />
            </div>

            {/* Radio Button for Status */}
            <div className="space-y-2">
              <Label>Status</Label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="Active"
                    checked={modalProgram.status === "Active"}
                    onChange={(e) =>
                      setModalProgram({
                        ...modalProgram,
                        status: e.target.value,
                      })
                    }
                  />
                  Active
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="Inactive"
                    checked={modalProgram.status === "Inactive"}
                    onChange={(e) =>
                      setModalProgram({
                        ...modalProgram,
                        status: e.target.value,
                      })
                    }
                  />
                  Inactive
                </label>
              </div>
            </div>

            {/* Boolean Fields */}
            <div className="space-y-2">
              <Label>In Person (Y/N)</Label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="true"
                    checked={modalProgram.inPerson === "true"}
                    onChange={(e) =>
                      setModalProgram({
                        ...modalProgram,
                        inPerson: e.target.value,
                      })
                    }
                  />
                  Y
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="false"
                    checked={modalProgram.inPerson === "false"}
                    onChange={(e) =>
                      setModalProgram({
                        ...modalProgram,
                        inPerson: e.target.value,
                      })
                    }
                  />
                  N
                </label>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Remote (Y/N)</Label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="true"
                    checked={modalProgram.remote === "true"}
                    onChange={(e) =>
                      setModalProgram({
                        ...modalProgram,
                        remote: e.target.value,
                      })
                    }
                  />
                  Y
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="false"
                    checked={modalProgram.remote === "false"}
                    onChange={(e) =>
                      setModalProgram({
                        ...modalProgram,
                        remote: e.target.value,
                      })
                    }
                  />
                  N
                </label>
              </div>
            </div>

            <div className="space-y-2 col-span-2">
              <Label>Description</Label>
              <Textarea
                value={modalProgram.description}
                onChange={(e) =>
                  setModalProgram({
                    ...modalProgram,
                    description: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Thumbnail Image URL</Label>
              <Input
                value={modalProgram.thumbnailImage}
                onChange={(e) =>
                  setModalProgram({
                    ...modalProgram,
                    thumbnailImage: e.target.value,
                  })
                }
              />
            </div>

            {/* Location Fieldset */}
            <div className="col-span-2 space-y-4">
              <Label className="font-semibold">Locations</Label>
              {modalProgram.location.map((loc, idx) => (
                <div key={idx} className="grid grid-cols-4 gap-2">
                  <div className="space-y-1">
                    <Label>Name</Label>
                    <Input
                      value={loc.name}
                      onChange={(e) => {
                        const updated = [...modalProgram.location];
                        updated[idx].name = e.target.value;
                        setModalProgram({
                          ...modalProgram,
                          location: updated,
                        });
                      }}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Start Date</Label>
                    <Input
                      type="date"
                      value={loc.startDate}
                      onChange={(e) => {
                        const updated = [...modalProgram.location];
                        updated[idx].startDate = e.target.value;
                        setModalProgram({
                          ...modalProgram,
                          location: updated,
                        });
                      }}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>End Date</Label>
                    <Input
                      type="date"
                      value={loc.endDate}
                      onChange={(e) => {
                        const updated = [...modalProgram.location];
                        updated[idx].endDate = e.target.value;
                        setModalProgram({
                          ...modalProgram,
                          location: updated,
                        });
                      }}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Instructor</Label>
                    <Input
                      value={loc.instructor}
                      onChange={(e) => {
                        const updated = [...modalProgram.location];
                        updated[idx].instructor = e.target.value;
                        setModalProgram({
                          ...modalProgram,
                          location: updated,
                        });
                      }}
                    />
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() =>
                  setModalProgram({
                    ...modalProgram,
                    location: [
                      ...modalProgram.location,
                      {
                        name: "",
                        startDate: "",
                        endDate: "",
                        instructor: "",
                      },
                    ],
                  })
                }
              >
                Add Location
              </Button>
            </div>

            {/* Schedule Fieldset */}
            <div className="col-span-2 space-y-4">
              <Label className="font-semibold">Schedule</Label>
              {Object.entries(modalProgram.schedule).map(([day, slots]) => (
                <div key={day} className="mb-3">
                  <Label className="mb-3">{day}</Label>
                  {slots.map((slot, idx) => (
                    <div key={idx} className="grid grid-cols-3 gap-2 mb-2">
                      <div className="space-y-1">
                        <Label>ID</Label>
                        <Input value={slot.id} readOnly disabled />
                      </div>
                      <div className="space-y-1">
                        <Label>From</Label>
                        <Input
                          type="time"
                          value={slot.from}
                          onChange={(e) => {
                            const updated = { ...modalProgram.schedule };
                            updated[day][idx].from = e.target.value;
                            setModalProgram({
                              ...modalProgram,
                              schedule: updated,
                            });
                          }}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label>To</Label>
                        <Input
                          type="time"
                          value={slot.to}
                          onChange={(e) => {
                            const updated = { ...modalProgram.schedule };
                            updated[day][idx].to = e.target.value;
                            setModalProgram({
                              ...modalProgram,
                              schedule: updated,
                            });
                          }}
                        />
                      </div>
                    </div>
                  ))}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const updated = { ...modalProgram.schedule };
                      updated[day].push({
                        id: Math.random().toString(36).substr(2, 8),
                        from: "",
                        to: "",
                      });
                      setModalProgram({
                        ...modalProgram,
                        schedule: updated,
                      });
                    }}
                  >
                    Add {day} Slot
                  </Button>
                </div>
              ))}
            </div>

            <div className="col-span-2">
              <Button className="w-full" onClick={onSave}>
                Save Program
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

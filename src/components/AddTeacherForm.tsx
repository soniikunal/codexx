import axios from "@/lib/axios";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
interface Teacher {
  _id?: string;
  name: string;
  profile_url: string;
  address: string;
  educationalDetail: string;
  description: string;
}
export default function AddTeacherForm({
  onAdd,
}: {
  onAdd: (t: Teacher) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [modalTeacher, setModalTeacher] = useState<
    Omit<Teacher, "profile_url">
  >({
    name: "",
    address: "",
    educationalDetail: "",
    description: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  //   const handleSave = async () => {
  //     debugger
  //     const formData = new FormData();
  //     formData.append("name", modalTeacher.name);
  //     formData.append("address", modalTeacher.address);
  //     formData.append("educationalDetail", modalTeacher.educationalDetail);
  //     formData.append("description", modalTeacher.description);
  //     if (fileInputRef.current?.files?.[0]) {
  //       formData.append("photo", fileInputRef.current.files[0]);
  //     }

  //     try {
  //       const res = await axios.post("/teacher", formData);
  //       onAdd(res.data);
  //     } catch (err) {
  //       toast.error("Failed to save teacher");
  //     }
  //   };
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    debugger
    if (!file) {
      alert("Please select a file first!");
      return;
    }
    const formData = new FormData();
    formData.append("name", modalTeacher.name);
    formData.append("address", modalTeacher.address);
    formData.append("educationalDetail", modalTeacher.educationalDetail);
    formData.append("description", modalTeacher.description);
    formData.append("photo", file); // file must be a File object from input

    try {
      const res = await fetch("/api/teacher", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("Success:", data);
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  return (
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
      {/* <Input type="file" ref={fileInputRef} accept="image/*" /> */}
      <input
        type="file"
        name="photo"
        onChange={(e) => {
          const selected = e.target.files?.[0];
          if (selected) setFile(selected);
        }}
      />
      <Button type="button" onClick={handleSave}>
        Save
      </Button>
    </form>
  );
}

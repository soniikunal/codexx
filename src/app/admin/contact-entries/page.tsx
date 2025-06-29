"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

interface Contact {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  course: string;
  createdAt: string;
}

export default function ContactEntries() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const fetchContacts = async () => {
    try {
      const res = await fetch(`/api/contact?name=${searchTerm}&page=${page}&limit=${limit}`);
      const result = await res.json();
      setContacts(result.data);
      setTotal(result.total);
    } catch {
      toast.error("Failed to load contacts");
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [searchTerm, page]);

  const handleDownloadCSV = () => {
    window.open("/api/contact?export=csv", "_blank");
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-2">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Contact Submissions</h2>
        <Button disabled={contacts.length === 0 } onClick={handleDownloadCSV}>Export CSV</Button>
      </div>

      <Input
        placeholder="Search by name..."
        value={searchTerm}
        onChange={(e) => {
          setPage(1); // reset to first page on search
          setSearchTerm(e.target.value);
        }}
        className="mb-4 max-w-md"
      />

      <div className="overflow-x-auto border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">No entries found</TableCell>
              </TableRow>
            ) : (
              contacts.map((c) => (
                <TableRow key={c._id}>
                  <TableCell>{c.name}</TableCell>
                  <TableCell>{c.email}</TableCell>
                  <TableCell>{c.phone}</TableCell>
                  <TableCell>{c.message}</TableCell>
                  <TableCell>{c.course}</TableCell>
                  <TableCell>{new Date(c.createdAt).toLocaleString()}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <span>Page {page} of {totalPages}</span>
        <div className="space-x-2">
          <Button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
          <Button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
        </div>
      </div>
    </div>
  );
}

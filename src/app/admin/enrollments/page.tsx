"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useDebounce } from "@/lib/useDebounce";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";

type Subscription = {
  _id: string;
  sk: string;
  courseName: string;
  createdAt: string;
  studentInfo: {
    firstName: string;
    lastName: string;
    dob: string;
  };
  familyInfo: {
    name: string;
    email: string;
  };
};

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [selected, setSelected] = useState<Subscription | null>(null);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const limit = 10;

  useEffect(() => {
    fetchSubscriptions();
  }, [debouncedSearch, page, dateRange]);

  const fetchSubscriptions = async () => {
    try {
      const params = new URLSearchParams({
        q: debouncedSearch,
        page: page.toString(),
        limit: limit.toString(),
      });
      if (dateRange?.from) {
        params.append("startDate", dateRange.from.toISOString());
      }
      if (dateRange?.to) {
        params.append("endDate", dateRange.to.toISOString());
      }
      const res = await axios.get(`/enrollment?${params.toString()}`);
      setSubscriptions(res.data.data);
      setTotal(res.data.total);
    } catch (err) {
      toast.error("Failed to fetch enrollment data.");
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Enrollments</h2>
      </div>

      <div className="flex flex-wrap gap-4 mb-4">
        <Input
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => {
            setPage(1);
            setSearchTerm(e.target.value);
          }}
          className="max-w-md"
        />
        <DateRangePicker date={dateRange} setDate={setDateRange} />
      </div>

      <div className="overflow-x-auto border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SK</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Student</TableHead>
              <TableHead>Parent Email</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscriptions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No entries found
                </TableCell>
              </TableRow>
            ) : (
              subscriptions.map((sub) => (
                <TableRow key={sub._id}>
                  <TableCell>{sub.sk}</TableCell>
                  <TableCell>{sub.courseName}</TableCell>
                  <TableCell>
                    {sub.studentInfo.firstName} {sub.studentInfo.lastName}
                  </TableCell>
                  <TableCell>{sub.familyInfo.email}</TableCell>
                  <TableCell>
                    {format(new Date(sub.createdAt), "dd MMM yyyy")}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelected(sub);
                        setOpen(true);
                      }}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Subscription Details</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold">Student Info</h4>
                <p>
                  Name: {selected.studentInfo.firstName}{" "}
                  {selected.studentInfo.lastName}
                </p>
                <p>DOB: {selected.studentInfo.dob}</p>
              </div>
              <div>
                <h4 className="font-semibold">Family Info</h4>
                <p>Name: {selected.familyInfo.name}</p>
                <p>Email: {selected.familyInfo.email}</p>
              </div>
              <div>
                <h4 className="font-semibold">Subscription Info</h4>
                <p>SK: {selected.sk}</p>
                <p>Course: {selected.courseName}</p>
                <p>
                  Created At:{" "}
                  {format(new Date(selected.createdAt), "dd MMM yyyy")}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
            />
          </PaginationItem>
          <PaginationItem className="px-3 py-1">
            Page {page} of {totalPages}
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

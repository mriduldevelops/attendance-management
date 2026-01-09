"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { initialStudents } from "@/lib/students";

import {
  Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const STORAGE_KEY = "students_v1";

function readStudents() {
  if (typeof window === "undefined") return initialStudents;
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : initialStudents;
}

function writeStudents(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function getNextStudentId(list) {
  // STD-001 -> 1
  const max = list.reduce((acc, s) => {
    const n = parseInt(String(s.id).split("-")[1], 10);
    return Number.isFinite(n) ? Math.max(acc, n) : acc;
  }, 0);

  return `STD-${String(max + 1).padStart(3, "0")}`;
}

export default function StudentsPage() {
  const router = useRouter();

  // ✅ IMPORTANT: initialize from localStorage immediately
  const [students, setStudents] = useState(() => readStudents()); // [web:130]
  const [search, setSearch] = useState("");

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addForm, setAddForm] = useState({
    name: "",
    className: "",
    phone: "",
    address: "",
  });

  // ✅ Persist whenever students change
  useEffect(() => {
    writeStudents(students);
  }, [students]); // [web:134]

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return students;
    return students.filter((s) =>
      [s.name, s.id, s.className, s.phone, s.address].join(" ").toLowerCase().includes(q)
    );
  }, [students, search]);

  const addStudent = () => {
    if (!addForm.name || !addForm.className) return;

    setStudents((prev) => {
      const newStudent = {
        id: getNextStudentId(prev),
        name: addForm.name,
        className: addForm.className,
        phone: addForm.phone,
        address: addForm.address,
        photoUrl: "", // will be edited on profile page
      };

      const updated = [...prev, newStudent];
      return updated;
    });

    setAddForm({ name: "", className: "", phone: "", address: "" });
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder="Search by name / id / class / phone / address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-96"
        />

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button>Add Student</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Student</DialogTitle>
              <DialogDescription>
                Student ID will be auto-generated on save.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="name">Student name</Label>
                <Input
                  id="name"
                  value={addForm.name}
                  onChange={(e) => setAddForm((p) => ({ ...p, name: e.target.value }))}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="className">Class</Label>
                <Input
                  id="className"
                  value={addForm.className}
                  onChange={(e) => setAddForm((p) => ({ ...p, className: e.target.value }))}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={addForm.phone}
                  onChange={(e) => setAddForm((p) => ({ ...p, phone: e.target.value }))}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={addForm.address}
                  onChange={(e) => setAddForm((p) => ({ ...p, address: e.target.value }))}
                />
              </div>

              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={addStudent}>Save</Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-x-auto rounded-md border bg-card shadow-sm">
        <Table>
          <TableCaption>{filtered.length} of {students.length} students</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80]">Sr No.</TableHead>
              <TableHead>Student name</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Address</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filtered.map((s, idx) => (
              <TableRow
                key={s.id}
                className="cursor-pointer"
                onClick={() => router.push(`/dashboard/students/${s.id}`)}
              >
                <TableCell>{idx + 1}</TableCell>
                <TableCell className="font-medium">{s.name}</TableCell>
                <TableCell>{s.id}</TableCell>
                <TableCell>{s.className}</TableCell>
                <TableCell>{s.phone}</TableCell>
                <TableCell>{s.address}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

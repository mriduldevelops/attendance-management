"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { initialStudents } from "@/lib/students";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const STORAGE_KEY = "students_v1";

function loadStudents() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : initialStudents;
  } catch {
    return initialStudents;
  }
}
function saveStudents(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function StudentProfilePage() {
  const router = useRouter();
  const params = useParams();
  const studentId = String(params.id);

  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(null);

  useEffect(() => {
    const list = loadStudents();
    setStudents(list);

    const found = list.find((s) => s.id === studentId);
    setForm(found || null);
  }, [studentId]);

  const initials = useMemo(() => {
    if (!form?.name) return "ST";
    return form.name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0]?.toUpperCase())
      .join("");
  }, [form]);

  const updateStudent = () => {
    if (!form?.name || !form?.id || !form?.className) return;

    // if ID changed, ensure unique
    const idChanged = form.id !== studentId;
    if (idChanged && students.some((s) => s.id === form.id)) return;

    const updated = students.map((s) => (s.id === studentId ? form : s));
    saveStudents(updated);
    setStudents(updated);

    // if ID changed, go to new route
    if (idChanged) router.replace(`/students/${form.id}`);
  };

  const deleteStudent = () => {
    const updated = students.filter((s) => s.id !== studentId);
    saveStudents(updated);
    router.push("/dashboard/students");
  };

  if (!form) {
    return (
      <div className="rounded-md border p-4 mt-10">
        Student not found.
        <div className="mt-3">
          <Button variant="outline" onClick={() => router.push("/students")}>
            Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 mt-16 px-4">
      <div className="flex items-center gap-4 rounded-md border bg-card p-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={form.photoUrl || ""} alt={form.name} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="text-lg font-semibold">{form.name}</div>
          <div className="text-sm text-muted-foreground">{form.id}</div>

          <div className="mt-3 space-y-2">
            <Label htmlFor="photo">Profile picture</Label>
            <Input
              id="photo"
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const dataUrl = await fileToDataUrl(file);
                setForm((p) => ({ ...p, photoUrl: dataUrl }));
              }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-3 rounded-md border bg-card p-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <Label htmlFor="name">Student name</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="id">Student ID</Label>
            <Input
              id="id"
              value={form.id}
              onChange={(e) => setForm((p) => ({ ...p, id: e.target.value }))}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="className">Class</Label>
            <Input
              id="className"
              value={form.className}
              onChange={(e) => setForm((p) => ({ ...p, className: e.target.value }))}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={form.phone}
              onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
            />
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            value={form.address}
            onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
          />
        </div>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="destructive" onClick={deleteStudent}>
            Delete student
          </Button>
          <Button onClick={updateStudent}>Save changes</Button>
          <Button variant="outline" onClick={() => router.push("/dashboard/students")}>
            Back
          </Button>
        </div>
      </div>
    </div>
  );
}

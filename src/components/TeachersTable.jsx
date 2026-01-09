"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const initialTeachers = [
  {
    id: "TCH-001",
    name: "Aman Sharma",
    phone: "+91 98765 00001",
    address: "Rohtak, Haryana",
    avatarUrl: "https://api.dicebear.com/9.x/initials/svg?seed=Aman+Sharma",
  },
  {
    id: "TCH-002",
    name: "Neha Verma",
    phone: "+91 98765 00002",
    address: "Hisar, Haryana",
    avatarUrl: "https://api.dicebear.com/9.x/initials/svg?seed=Neha+Verma",
  },
  {
    id: "TCH-003",
    name: "Rohit Yadav",
    phone: "+91 98765 00003",
    address: "Gurugram, Haryana",
    avatarUrl: "https://api.dicebear.com/9.x/initials/svg?seed=Rohit+Yadav",
  },
];

export default function TeachersTable() {
  const [teachers, setTeachers] = useState(initialTeachers);
  const [search, setSearch] = useState("");
  
  // Add Dialog State
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [addTeacherData, setAddTeacherData] = useState({
    name: "",
    phone: "",
    address: "",
    photo: null,
  });
  const [addPhotoPreview, setAddPhotoPreview] = useState("");

  // Edit Dialog State
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editTeacherData, setEditTeacherData] = useState({
    id: "",
    name: "",
    phone: "",
    address: "",
    photo: null,
  });
  const [editPhotoPreview, setEditPhotoPreview] = useState("");

  // Cleanup blob URLs only on unmount
  useEffect(() => {
    return () => {
      if (addPhotoPreview && addPhotoPreview.startsWith("blob:")) {
        URL.revokeObjectURL(addPhotoPreview);
      }
      if (editPhotoPreview && editPhotoPreview.startsWith("blob:")) {
        URL.revokeObjectURL(editPhotoPreview);
      }
    };
  }, []);

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(search.toLowerCase()) ||
      teacher.id.toLowerCase().includes(search.toLowerCase())
  );

  // Add Handlers
  const handleAddPhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setAddTeacherData((prev) => ({ ...prev, photo: file }));
      setAddPhotoPreview(previewUrl);
    }
  };

  const handleAddTeacher = () => {
    if (!addTeacherData.name || !addTeacherData.phone || !addTeacherData.address) return;

    const avatarUrl = addPhotoPreview || `https://api.dicebear.com/9.x/initials/svg?seed=${addTeacherData.name}`;
    
    const newTeacher = {
      id: `TCH-${String(teachers.length + 1).padStart(3, "0")}`,
      name: addTeacherData.name,
      phone: addTeacherData.phone,
      address: addTeacherData.address,
      avatarUrl: avatarUrl,
    };

    setTeachers((prev) => [...prev, newTeacher]);
    
    // Reset form (DON'T revoke URL yet - table still needs it)
    setAddTeacherData({ name: "", phone: "", address: "", photo: null });
    setAddPhotoPreview("");
    setIsAddDialogOpen(false);
  };

  // Edit Handlers
  const handleEdit = (teacher) => {
    setEditTeacherData({
      id: teacher.id,
      name: teacher.name,
      phone: teacher.phone,
      address: teacher.address,
      photo: null,
    });
    setEditPhotoPreview(teacher.avatarUrl);
    setIsEditDialogOpen(true);
  };

  const handleEditPhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setEditTeacherData((prev) => ({ ...prev, photo: file }));
      setEditPhotoPreview(previewUrl);
    }
  };

  const handleUpdateTeacher = () => {
    if (!editTeacherData.name || !editTeacherData.phone || !editTeacherData.address) return;

    setTeachers((prev) =>
      prev.map((teacher) =>
        teacher.id === editTeacherData.id
          ? {
              ...teacher,
              name: editTeacherData.name,
              phone: editTeacherData.phone,
              address: editTeacherData.address,
              avatarUrl: editPhotoPreview,
            }
          : teacher
      )
    );

    setEditTeacherData({ id: "", name: "", phone: "", address: "", photo: null });
    setEditPhotoPreview("");
    setIsEditDialogOpen(false);
  };

  const handleDelete = (teacher) => {
    setTeachers(teachers.filter((t) => t.id !== teacher.id));
  };

  return (
    <div className="space-y-4">
      {/* Header with Search & Add Button */}
      <div className="flex flex-col sm:flex-row gap-2 justify-between items-start sm:items-center">
        <Input
          placeholder="Search teachers by name or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-64"
        />

        {/* Add Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>+ Add Teacher</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Teacher</DialogTitle>
              <DialogDescription>
                Enter teacher details including profile photo.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {/* Photo Upload */}
              <div className="space-y-2">
                <Label htmlFor="add-photo">Profile Photo (optional)</Label>
                <Input
                  id="add-photo"
                  type="file"
                  accept="image/*"
                  onChange={handleAddPhotoChange}
                />
                {addPhotoPreview && (
                  <div className="mt-2 flex justify-center">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={addPhotoPreview} className="object-cover" />
                      <AvatarFallback>
                        {addTeacherData.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                )}
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="add-name">Full Name</Label>
                <Input
                  id="add-name"
                  value={addTeacherData.name}
                  onChange={(e) =>
                    setAddTeacherData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="add-phone">Phone Number</Label>
                <Input
                  id="add-phone"
                  value={addTeacherData.phone}
                  onChange={(e) =>
                    setAddTeacherData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  required
                />
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="add-address">Address</Label>
                <Input
                  id="add-address"
                  value={addTeacherData.address}
                  onChange={(e) =>
                    setAddTeacherData((prev) => ({ ...prev, address: e.target.value }))
                  }
                  required
                />
              </div>

              <DialogFooter className="gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    setAddTeacherData({ name: "", phone: "", address: "", photo: null });
                    setAddPhotoPreview("");
                  }}
                >
                  Cancel
                </Button>
                <Button type="button" onClick={handleAddTeacher}>
                  Add Teacher
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto rounded-md border bg-card shadow-sm">
        <Table>
          <TableCaption>
            {filteredTeachers.length} of {teachers.length} teachers
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80]">Profile</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Address</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTeachers.map((teacher) => (
              <TableRow key={teacher.id}>
                <TableCell>
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={teacher.avatarUrl}
                      alt={teacher.name}
                      className="object-cover"
                    />
                    <AvatarFallback className="text-xs">
                      {teacher.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium">{teacher.name}</TableCell>
                <TableCell>{teacher.id}</TableCell>
                <TableCell>{teacher.phone}</TableCell>
                <TableCell>{teacher.address}</TableCell>
                <TableCell className="flex justify-end gap-1 md:gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(teacher)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(teacher)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Teacher</DialogTitle>
            <DialogDescription>Update teacher details and profile photo.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Photo Upload */}
            <div className="space-y-2">
              <Label htmlFor="edit-photo">Profile Photo (optional)</Label>
              <Input
                id="edit-photo"
                type="file"
                accept="image/*"
                onChange={handleEditPhotoChange}
              />
              {editPhotoPreview && (
                <div className="mt-2 flex justify-center">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={editPhotoPreview} className="object-cover" />
                    <AvatarFallback>
                      {editTeacherData.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
              )}
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input
                id="edit-name"
                value={editTeacherData.name}
                onChange={(e) =>
                  setEditTeacherData((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Phone Number</Label>
              <Input
                id="edit-phone"
                value={editTeacherData.phone}
                onChange={(e) =>
                  setEditTeacherData((prev) => ({ ...prev, phone: e.target.value }))
                }
                required
              />
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="edit-address">Address</Label>
              <Input
                id="edit-address"
                value={editTeacherData.address}
                onChange={(e) =>
                  setEditTeacherData((prev) => ({ ...prev, address: e.target.value }))
                }
                required
              />
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(false);
                  setEditTeacherData({ id: "", name: "", phone: "", address: "", photo: null });
                  setEditPhotoPreview("");
                }}
              >
                Cancel
              </Button>
              <Button type="button" onClick={handleUpdateTeacher}>
                Update Teacher
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

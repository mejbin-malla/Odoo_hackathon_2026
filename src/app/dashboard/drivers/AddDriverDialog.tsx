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
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { createDriver } from "@/actions/drivers";

export function AddDriverDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await createDriver(formData);

    if (result.success) {
      setOpen(false);
    } else {
      setError(result.error || "Something went wrong");
    }
    setLoading(false);
  }

  return (
    <>
      <Button className="gap-2" onClick={() => setOpen(true)}>
        <Plus className="w-4 h-4" /> Add Driver
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Driver</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          {error && <div className="text-destructive text-sm">{error}</div>}
          
          <div className="grid gap-2">
            <Input id="name" name="name" required placeholder="Full Name" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Input id="licenseNumber" name="licenseNumber" required placeholder="License Number" />
            </div>
            <div className="grid gap-2">
              <Input id="licenseCategory" name="licenseCategory" required placeholder="License Category" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Input id="licenseExpiryDate" name="licenseExpiryDate" type="date" required placeholder="License Expiry" />
            </div>
            <div className="grid gap-2">
              <Input id="contactNumber" name="contactNumber" required placeholder="Contact Number" />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <select 
              id="status" 
              name="status" 
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="Available">Available</option>
              <option value="On Trip">On Trip</option>
              <option value="Off Duty">Off Duty</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>

          <Button type="submit" disabled={loading} className="mt-4">
            {loading ? "Adding..." : "Add Driver"}
          </Button>
        </form>
      </DialogContent>
      </Dialog>
    </>
  );
}

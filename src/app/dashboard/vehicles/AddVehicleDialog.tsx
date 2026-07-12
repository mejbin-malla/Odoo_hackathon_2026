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
import { createVehicle } from "@/actions/vehicles";

export function AddVehicleDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await createVehicle(formData);

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
        <Plus className="w-4 h-4" /> Add Vehicle
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Vehicle</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          {error && <div className="text-destructive text-sm">{error}</div>}
          
          <div className="grid gap-2">
            <Input id="registrationNumber" name="registrationNumber" required placeholder="Registration Number" />
          </div>

          <div className="grid gap-2">
            <Input id="name" name="name" required placeholder="Vehicle Name / Model" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="type">Vehicle Type</Label>
              <select 
                id="type" 
                name="type" 
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="Truck">Truck</option>
                <option value="Van">Van</option>
                <option value="Trailer">Trailer</option>
              </select>
            </div>
            <div className="grid gap-2">
              <Input id="maxLoadCapacity" name="maxLoadCapacity" type="number" required min="0" placeholder="Max Capacity (kg)" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Input id="acquisitionCost" name="acquisitionCost" type="number" required min="0" placeholder="Acquisition Cost" />
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
                <option value="In Shop">In Shop</option>
                <option value="Retired">Retired</option>
              </select>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="mt-4">
            {loading ? "Adding..." : "Add Vehicle"}
          </Button>
        </form>
      </DialogContent>
      </Dialog>
    </>
  );
}

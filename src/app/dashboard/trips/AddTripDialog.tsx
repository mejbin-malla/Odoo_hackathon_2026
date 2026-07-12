"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { createTrip } from "@/actions/trips";

export function AddTripDialog({ vehicles, drivers }: { vehicles: any[], drivers: any[] }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    const formData = new FormData(e.currentTarget);
    
    try {
      await createTrip({
        source: formData.get("source"),
        destination: formData.get("destination"),
        vehicleId: formData.get("vehicleId"),
        driverId: formData.get("driverId"),
        cargoWeight: formData.get("cargoWeight"),
        plannedDistance: formData.get("plannedDistance"),
      });
      setOpen(false);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to create trip.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button className="gap-2" onClick={() => setOpen(true)}>
        <Plus className="w-4 h-4" /> Create Trip
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Trip</DialogTitle>
          </DialogHeader>
          <form onSubmit={onSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md">
                {errorMsg}
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Input id="source" name="source" required placeholder="Source" />
              </div>
              <div className="space-y-2">
                <Input id="destination" name="destination" required placeholder="Destination" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicleId">Assign Vehicle</Label>
              <select 
                id="vehicleId" 
                name="vehicleId" 
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select a vehicle...</option>
                {vehicles.filter(v => v.status === "Available").map(v => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.registrationNumber}) - Max {v.maxLoadCapacity}kg
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="driverId">Assign Driver</Label>
              <select 
                id="driverId" 
                name="driverId" 
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select a driver...</option>
                {drivers.filter(d => {
                  const isExpired = new Date(d.licenseExpiryDate) < new Date();
                  return d.status === "Available" && !isExpired;
                }).map(d => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.licenseCategory})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Input id="cargoWeight" name="cargoWeight" type="number" step="0.1" min="0" required placeholder="Cargo Weight (kg)" />
              </div>
              <div className="space-y-2">
                <Input id="plannedDistance" name="plannedDistance" type="number" step="0.1" min="0" required placeholder="Distance (km)" />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating..." : "Create Trip"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

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
import { createExpense } from "@/actions/financials";
import { Textarea } from "@/components/ui/textarea";

export function AddExpenseDialog({ vehicles }: { vehicles: any[] }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    await createExpense({
      vehicleId: formData.get("vehicleId"),
      description: formData.get("description"),
      cost: formData.get("cost"),
      date: formData.get("date"),
    });

    setLoading(false);
    setOpen(false);
  }

  return (
    <>
      <Button className="gap-2" onClick={() => setOpen(true)}>
        <Plus className="w-4 h-4" /> Log Expense
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log Operational Expense</DialogTitle>
          </DialogHeader>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="vehicleId">Vehicle</Label>
              <select 
                id="vehicleId" 
                name="vehicleId" 
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Select a vehicle...</option>
                {vehicles.map(v => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.registrationNumber})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" required placeholder="Tolls, fines, parts, etc." />
            </div>

            <div className="space-y-2">
              <Input id="cost" name="cost" type="number" step="0.01" min="0" required placeholder="Total Cost ($)" />
            </div>

            <div className="space-y-2">
              <Input id="date" name="date" type="datetime-local" required placeholder="Date" defaultValue={new Date().toISOString().slice(0, 16)} />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Saving..." : "Log Expense"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

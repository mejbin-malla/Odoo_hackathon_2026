"use server";

import { db } from "@/db";
import { vehicles } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getVehicles() {
  try {
    return await db.select().from(vehicles).orderBy(desc(vehicles.createdAt));
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    return [];
  }
}

export async function getVehicleById(id: string) {
  try {
    const [vehicle] = await db.select().from(vehicles).where(eq(vehicles.id, id));
    return vehicle;
  } catch (error) {
    console.error("Error fetching vehicle:", error);
    return null;
  }
}

export async function createVehicle(formData: FormData) {
  try {
    const data = {
      registrationNumber: formData.get("registrationNumber") as string,
      name: formData.get("name") as string,
      type: formData.get("type") as string,
      maxLoadCapacity: Number(formData.get("maxLoadCapacity")),
      acquisitionCost: Number(formData.get("acquisitionCost")),
      status: (formData.get("status") || "Available") as "Available" | "On Trip" | "In Shop" | "Retired",
    };
    await db.insert(vehicles).values(data);
    revalidatePath("/dashboard/vehicles");
    return { success: true };
  } catch (error: any) {
    console.error("Error creating vehicle:", error);
    return { success: false, error: error.message || "Failed to create vehicle" };
  }
}

export async function updateVehicle(id: string, formData: FormData) {
  try {
    const data = {
      name: formData.get("name") as string,
      type: formData.get("type") as string,
      maxLoadCapacity: Number(formData.get("maxLoadCapacity")),
      status: (formData.get("status") as "Available" | "On Trip" | "In Shop" | "Retired") || undefined,
    };
    await db.update(vehicles).set(data).where(eq(vehicles.id, id));
    revalidatePath("/dashboard/vehicles");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating vehicle:", error);
    return { success: false, error: error.message || "Failed to update vehicle" };
  }
}

export async function deleteVehicle(id: string) {
  try {
    await db.delete(vehicles).where(eq(vehicles.id, id));
    revalidatePath("/dashboard/vehicles");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting vehicle:", error);
    return { success: false, error: error.message || "Failed to delete vehicle" };
  }
}

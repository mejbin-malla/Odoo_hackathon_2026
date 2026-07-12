"use server";

import { db } from "@/db";
import { drivers } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getDrivers() {
  try {
    return await db.select().from(drivers).orderBy(desc(drivers.createdAt));
  } catch (error) {
    console.error("Error fetching drivers:", error);
    return [];
  }
}

export async function createDriver(formData: FormData) {
  try {
    const data = {
      name: formData.get("name") as string,
      licenseNumber: formData.get("licenseNumber") as string,
      licenseCategory: formData.get("licenseCategory") as string,
      licenseExpiryDate: new Date(formData.get("licenseExpiryDate") as string),
      contactNumber: formData.get("contactNumber") as string,
      status: (formData.get("status") || "Available") as "Available" | "On Trip" | "Off Duty" | "Suspended",
    };
    await db.insert(drivers).values(data);
    revalidatePath("/dashboard/drivers");
    return { success: true };
  } catch (error: any) {
    console.error("Error creating driver:", error);
    return { success: false, error: error.message || "Failed to create driver" };
  }
}

export async function deleteDriver(id: string) {
  try {
    await db.delete(drivers).where(eq(drivers.id, id));
    revalidatePath("/dashboard/drivers");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting driver:", error);
    return { success: false, error: error.message || "Failed to delete driver" };
  }
}

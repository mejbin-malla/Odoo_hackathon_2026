"use server";

import { db } from "@/db";
import { maintenanceLogs, vehicles } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { eq, desc } from "drizzle-orm";

export async function getMaintenanceLogs() {
  return await db.select({
    id: maintenanceLogs.id,
    vehicleId: maintenanceLogs.vehicleId,
    vehicleName: vehicles.name,
    vehicleRegistration: vehicles.registrationNumber,
    description: maintenanceLogs.description,
    cost: maintenanceLogs.cost,
    date: maintenanceLogs.date,
    isOpen: maintenanceLogs.isOpen,
  })
  .from(maintenanceLogs)
  .leftJoin(vehicles, eq(maintenanceLogs.vehicleId, vehicles.id))
  .orderBy(desc(maintenanceLogs.date));
}

export async function createMaintenanceLog(data: any) {
  await db.insert(maintenanceLogs).values({
    vehicleId: data.vehicleId,
    description: data.description,
    cost: parseFloat(data.cost),
    date: new Date(data.date),
    isOpen: true,
  });
  
  await db.update(vehicles).set({ status: "In Shop" }).where(eq(vehicles.id, data.vehicleId));
  
  revalidatePath("/dashboard/maintenance");
  revalidatePath("/dashboard/vehicles");
}

export async function completeMaintenanceLog(id: string, vehicleId: string) {
  await db.update(maintenanceLogs).set({ isOpen: false }).where(eq(maintenanceLogs.id, id));
  await db.update(vehicles).set({ status: "Available" }).where(eq(vehicles.id, vehicleId));
  
  revalidatePath("/dashboard/maintenance");
  revalidatePath("/dashboard/vehicles");
}

"use server";

import { db } from "@/db";
import { fuelLogs, expenses, vehicles } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { desc, eq } from "drizzle-orm";

export async function getFuelLogs() {
  return await db.select({
    id: fuelLogs.id,
    vehicleId: fuelLogs.vehicleId,
    vehicleName: vehicles.name,
    vehicleRegistration: vehicles.registrationNumber,
    liters: fuelLogs.liters,
    cost: fuelLogs.cost,
    date: fuelLogs.date,
  })
  .from(fuelLogs)
  .leftJoin(vehicles, eq(fuelLogs.vehicleId, vehicles.id))
  .orderBy(desc(fuelLogs.date));
}

export async function createFuelLog(data: any) {
  await db.insert(fuelLogs).values({
    vehicleId: data.vehicleId,
    liters: parseFloat(data.liters),
    cost: parseFloat(data.cost),
    date: new Date(data.date),
  });
  
  revalidatePath("/dashboard/financials");
  revalidatePath("/dashboard");
}

export async function getExpenses() {
  return await db.select({
    id: expenses.id,
    vehicleId: expenses.vehicleId,
    vehicleName: vehicles.name,
    vehicleRegistration: vehicles.registrationNumber,
    description: expenses.description,
    cost: expenses.cost,
    date: expenses.date,
  })
  .from(expenses)
  .leftJoin(vehicles, eq(expenses.vehicleId, vehicles.id))
  .orderBy(desc(expenses.date));
}

export async function createExpense(data: any) {
  await db.insert(expenses).values({
    vehicleId: data.vehicleId,
    description: data.description,
    cost: parseFloat(data.cost),
    date: new Date(data.date),
  });
  
  revalidatePath("/dashboard/financials");
  revalidatePath("/dashboard");
}

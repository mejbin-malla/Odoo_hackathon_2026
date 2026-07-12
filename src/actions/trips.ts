"use server";

import { db } from "@/db";
import { trips, vehicles, drivers } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { eq, desc } from "drizzle-orm";
import { sendEmail } from "@/lib/email";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getTrips() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userRole = session?.user?.role;
  const userName = session?.user?.name;

  let query = db.select({
    id: trips.id,
    source: trips.source,
    destination: trips.destination,
    vehicleId: trips.vehicleId,
    vehicleName: vehicles.name,
    driverId: trips.driverId,
    driverName: drivers.name,
    cargoWeight: trips.cargoWeight,
    plannedDistance: trips.plannedDistance,
    status: trips.status,
    createdAt: trips.createdAt,
  })
  .from(trips)
  .leftJoin(vehicles, eq(trips.vehicleId, vehicles.id))
  .leftJoin(drivers, eq(trips.driverId, drivers.id))
  .$dynamic();

  if (userRole === "Driver" && userName) {
    query = query.where(eq(drivers.name, userName));
  }

  return await query.orderBy(desc(trips.createdAt));
}

export async function createTrip(data: any) {
  // Check if vehicle is available
  const vehicle = await db.query.vehicles.findFirst({ where: eq(vehicles.id, data.vehicleId) });
  if (!vehicle || vehicle.status !== "Available") {
    throw new Error("Vehicle is currently not available for assignment.");
  }
  
  if (parseFloat(data.cargoWeight) > vehicle.maxLoadCapacity) {
    throw new Error(`Cargo weight (${data.cargoWeight}kg) exceeds vehicle capacity (${vehicle.maxLoadCapacity}kg).`);
  }

  // Check if driver is available
  const driver = await db.query.drivers.findFirst({ where: eq(drivers.id, data.driverId) });
  if (!driver || driver.status !== "Available") {
    throw new Error("Driver is currently not available for assignment.");
  }
  
  // Check if driver license is expired
  if (new Date(driver.licenseExpiryDate) < new Date()) {
    throw new Error("Cannot assign driver with an expired license.");
  }

  await db.insert(trips).values({
    source: data.source,
    destination: data.destination,
    vehicleId: data.vehicleId,
    driverId: data.driverId,
    cargoWeight: parseFloat(data.cargoWeight),
    plannedDistance: parseFloat(data.plannedDistance),
    status: "Draft",
  });
  
  // Immediately mark them as "On Trip" so they can't be assigned to another Draft
  await db.update(vehicles).set({ status: "On Trip" }).where(eq(vehicles.id, data.vehicleId));
  await db.update(drivers).set({ status: "On Trip" }).where(eq(drivers.id, data.driverId));

  revalidatePath("/dashboard/trips");
  revalidatePath("/dashboard/vehicles");
  revalidatePath("/dashboard/drivers");
}

export async function updateTripStatus(id: string, status: "Draft" | "Dispatched" | "Completed" | "Cancelled", vehicleId: string, driverId: string) {
  await db.update(trips).set({ status }).where(eq(trips.id, id));
  
  if (status === "Dispatched") {
    await db.update(vehicles).set({ status: "On Trip" }).where(eq(vehicles.id, vehicleId));
    await db.update(drivers).set({ status: "On Trip" }).where(eq(drivers.id, driverId));

    // Send email notification to driver
    const driver = await db.query.drivers.findFirst({ where: eq(drivers.id, driverId) });
    if (driver) {
      await sendEmail(
        "driver@transitops.local", 
        "New Trip Assigned", 
        `Hello ${driver.name},\n\nYou have been dispatched on a new trip. Please check your TransitOps dashboard for full details.\n\nDrive safe!`
      );
    }
  } else if (status === "Completed" || status === "Cancelled") {
    await db.update(vehicles).set({ status: "Available" }).where(eq(vehicles.id, vehicleId));
    await db.update(drivers).set({ status: "Available" }).where(eq(drivers.id, driverId));
  }
  
  revalidatePath("/dashboard/trips");
  revalidatePath("/dashboard/vehicles");
  revalidatePath("/dashboard/drivers");
}

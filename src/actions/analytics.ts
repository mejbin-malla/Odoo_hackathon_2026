"use server";

import { db } from "@/db";
import { vehicles, drivers, trips, maintenanceLogs, expenses } from "@/db/schema";
import { eq, sql, desc, lt } from "drizzle-orm";

export async function getFleetManagerAnalytics() {
  const totalVehicles = await db.select({ count: sql<number>`count(*)` }).from(vehicles);
  const totalDrivers = await db.select({ count: sql<number>`count(*)` }).from(drivers);
  const activeTrips = await db.select({ count: sql<number>`count(*)` }).from(trips).where(eq(trips.status, "Dispatched"));
  
  return {
    totalVehicles: totalVehicles[0].count,
    totalDrivers: totalDrivers[0].count,
    activeTrips: activeTrips[0].count,
  };
}

export async function getDriverAnalytics(driverName: string) {
  const driverRecord = await db.select().from(drivers).where(eq(drivers.name, driverName)).limit(1);
  
  if (driverRecord.length === 0) return { driverExists: false, myTrips: [] };

  const myTrips = await db.select({
      id: trips.id,
      source: trips.source,
      destination: trips.destination,
      status: trips.status,
      vehicleName: vehicles.name,
      plannedDistance: trips.plannedDistance
    })
    .from(trips)
    .leftJoin(vehicles, eq(trips.vehicleId, vehicles.id))
    .where(eq(trips.driverId, driverRecord[0].id))
    .orderBy(desc(trips.createdAt))
    .limit(5);

  return { driverExists: true, myTrips };
}

export async function getSafetyOfficerAnalytics() {
  const openMaintenance = await db.select({ count: sql<number>`count(*)` }).from(maintenanceLogs).where(eq(maintenanceLogs.isOpen, true));
  const avgSafetyScore = await db.select({ avg: sql<number>`avg(${drivers.safetyScore})` }).from(drivers);
  
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
  
  const atRiskDrivers = await db.select().from(drivers).where(lt(drivers.safetyScore, 80));
  const complianceIssues = await db.select().from(drivers).where(lt(drivers.licenseExpiryDate, thirtyDaysFromNow));
  
  return {
    openMaintenance: openMaintenance[0].count,
    avgSafetyScore: avgSafetyScore[0].avg || 100,
    atRiskDrivers,
    complianceIssues
  };
}

export async function getFinancialAnalystAnalytics() {
  const totalMaintenance = await db.select({ sum: sql<number>`sum(${maintenanceLogs.cost})` }).from(maintenanceLogs);
  const totalExpenses = await db.select({ sum: sql<number>`sum(${expenses.cost})` }).from(expenses);
  
  return {
    totalMaintenance: totalMaintenance[0].sum || 0,
    totalExpenses: totalExpenses[0].sum || 0,
  };
}

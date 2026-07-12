import { NextRequest, NextResponse } from "next/server";
import { getTrips } from "@/actions/trips";
import { getFuelLogs, getExpenses } from "@/actions/financials";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  const resolvedParams = await params;
  const type = resolvedParams.type;

  let csvContent = "";
  let filename = "";

  if (type === "trips") {
    const trips = await getTrips();
    csvContent = "Date,Source,Destination,Vehicle,Driver,Cargo Weight,Distance,Status\n";
    trips.forEach(t => {
      csvContent += `${new Date(t.createdAt).toISOString()},${t.source},${t.destination},${t.vehicleName},${t.driverName},${t.cargoWeight},${t.plannedDistance},${t.status}\n`;
    });
    filename = "trips_export.csv";
  } else if (type === "financials") {
    const fuel = await getFuelLogs();
    const expenses = await getExpenses();
    
    csvContent = "Type,Date,Vehicle,Description/Volume,Cost\n";
    
    fuel.forEach(f => {
      csvContent += `Fuel,${new Date(f.date).toISOString()},${f.vehicleName},${f.liters}L,${f.cost}\n`;
    });
    
    expenses.forEach(e => {
      csvContent += `Expense,${new Date(e.date).toISOString()},${e.vehicleName},"${e.description.replace(/"/g, '""')}",${e.cost}\n`;
    });
    
    filename = "financials_export.csv";
  } else {
    return new NextResponse("Invalid export type", { status: 400 });
  }

  return new NextResponse(csvContent, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}

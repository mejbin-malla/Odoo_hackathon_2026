import { getTrips, updateTripStatus } from "@/actions/trips";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getVehicles } from "@/actions/vehicles";
import { getDrivers } from "@/actions/drivers";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AddTripDialog } from "./AddTripDialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

function getStatusBadgeVariant(status: string) {
  switch (status) {
    case "Draft": return "secondary";
    case "Dispatched": return "default";
    case "Completed": return "outline";
    case "Cancelled": return "destructive";
    default: return "default";
  }
}

export default async function TripsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userRole = session?.user?.role || "Fleet Manager";
  const userName = session?.user?.name;

  const trips = await getTrips();
  const vehicles = await getVehicles();
  const drivers = await getDrivers();

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-heading">Trip Management</h1>
          <p className="text-muted-foreground mt-1">Dispatch and monitor active shipments.</p>
        </div>
        <div className="flex gap-4">
          <a href="/api/export/trips" download>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" /> Export CSV
            </Button>
          </a>
          {userRole !== "Driver" && (
            <AddTripDialog vehicles={vehicles} drivers={drivers} />
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active & Past Trips</CardTitle>
          <CardDescription>All logistics operations in the network.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Route</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Load/Dist</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trips.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground h-24">
                      No trips found. Create one to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  trips.map((trip) => (
                    <TableRow key={trip.id}>
                      <TableCell className="font-medium">
                        {trip.source} → {trip.destination}
                        <div className="text-xs text-muted-foreground mt-1">
                          {new Date(trip.createdAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>{trip.vehicleName}</TableCell>
                      <TableCell>{trip.driverName}</TableCell>
                      <TableCell>
                        {trip.cargoWeight}kg<br/>
                        <span className="text-xs text-muted-foreground">{trip.plannedDistance}km</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(trip.status)} className={trip.status === "Completed" ? "bg-green-500/10 text-green-500 hover:bg-green-500/20" : ""}>
                          {trip.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {userRole !== "Driver" && trip.status === "Draft" && (
                            <form action={async () => {
                              "use server";
                              await updateTripStatus(trip.id, "Dispatched", trip.vehicleId, trip.driverId);
                            }}>
                              <Button type="submit" size="sm">Dispatch</Button>
                            </form>
                          )}
                          {(userRole === "Fleet Manager" || userRole === "Driver") && trip.status === "Dispatched" && (
                            <form action={async () => {
                              "use server";
                              await updateTripStatus(trip.id, "Completed", trip.vehicleId, trip.driverId);
                            }}>
                              <Button type="submit" size="sm" variant="outline" className="border-green-500 text-green-500 hover:bg-green-500/10">Complete</Button>
                            </form>
                          )}
                          {userRole === "Fleet Manager" && (trip.status === "Draft" || trip.status === "Dispatched") && (
                            <form action={async () => {
                              "use server";
                              await updateTripStatus(trip.id, "Cancelled", trip.vehicleId, trip.driverId);
                            }}>
                              <Button type="submit" size="sm" variant="destructive" className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-transparent">Cancel</Button>
                            </form>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

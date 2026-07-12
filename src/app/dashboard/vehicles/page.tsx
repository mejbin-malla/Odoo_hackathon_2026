import { getVehicles } from "@/actions/vehicles";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AddVehicleDialog } from "./AddVehicleDialog";

export default async function VehiclesPage() {
  const vehiclesList = await getVehicles();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-heading font-bold text-primary">Vehicles</h1>
        <AddVehicleDialog />
      </div>

      <div className="border rounded-lg bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Registration</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Capacity (kg)</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehiclesList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                  No vehicles found.
                </TableCell>
              </TableRow>
            ) : (
              vehiclesList.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell className="font-mono">{vehicle.registrationNumber}</TableCell>
                  <TableCell className="font-medium">{vehicle.name}</TableCell>
                  <TableCell>{vehicle.type}</TableCell>
                  <TableCell>{vehicle.maxLoadCapacity}</TableCell>
                  <TableCell>
                    <Badge variant={vehicle.status === "Available" ? "default" : vehicle.status === "On Trip" ? "secondary" : "destructive"}>
                      {vehicle.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

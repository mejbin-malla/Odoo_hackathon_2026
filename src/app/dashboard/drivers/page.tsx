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
import { AddDriverDialog } from "./AddDriverDialog";

export default async function DriversPage() {
  const driversList = await getDrivers();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-heading font-bold text-primary">Drivers</h1>
        <AddDriverDialog />
      </div>

      <div className="border rounded-lg bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>License</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Safety Score</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {driversList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                  No drivers found.
                </TableCell>
              </TableRow>
            ) : (
              driversList.map((driver) => (
                <TableRow key={driver.id}>
                  <TableCell className="font-medium">{driver.name}</TableCell>
                  <TableCell className="font-mono">{driver.licenseNumber}</TableCell>
                  <TableCell>{driver.licenseCategory}</TableCell>
                  <TableCell>
                    <span className={`font-medium ${driver.safetyScore >= 90 ? 'text-green-500' : driver.safetyScore >= 70 ? 'text-yellow-500' : 'text-red-500'}`}>
                      {driver.safetyScore}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={driver.status === "Available" ? "default" : driver.status === "On Trip" ? "secondary" : driver.status === "Suspended" ? "destructive" : "outline"}>
                      {driver.status}
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

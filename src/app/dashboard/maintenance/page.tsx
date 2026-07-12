import { getMaintenanceLogs, completeMaintenanceLog } from "@/actions/maintenance";
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AddMaintenanceDialog } from "./AddMaintenanceDialog";
import { Button } from "@/components/ui/button";

export default async function MaintenancePage() {
  const logs = await getMaintenanceLogs();
  const vehicles = await getVehicles();

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-heading">Maintenance Logs</h1>
          <p className="text-muted-foreground mt-1">Track vehicle repairs and shop time.</p>
        </div>
        <AddMaintenanceDialog vehicles={vehicles} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Maintenance</CardTitle>
          <CardDescription>A complete log of all maintenance activities across your fleet.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground h-24">
                      No maintenance logs found.
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">
                        {new Date(log.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{log.vehicleName} ({log.vehicleRegistration})</TableCell>
                      <TableCell className="max-w-[300px] truncate">{log.description}</TableCell>
                      <TableCell>${log.cost.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={log.isOpen ? "destructive" : "default"} className={!log.isOpen ? "bg-green-500/10 text-green-500 hover:bg-green-500/20" : ""}>
                          {log.isOpen ? "In Progress" : "Completed"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {log.isOpen && (
                          <form action={async () => {
                            "use server";
                            await completeMaintenanceLog(log.id, log.vehicleId);
                          }}>
                            <Button type="submit" size="sm" variant="outline">
                              Mark Complete
                            </Button>
                          </form>
                        )}
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

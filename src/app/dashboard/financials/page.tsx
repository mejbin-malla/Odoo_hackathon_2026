import { getFuelLogs, getExpenses } from "@/actions/financials";
import { getVehicles } from "@/actions/vehicles";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AddFuelLogDialog } from "./AddFuelLogDialog";
import { AddExpenseDialog } from "./AddExpenseDialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default async function FinancialsPage() {
  const fuelLogs = await getFuelLogs();
  const expenses = await getExpenses();
  const vehicles = await getVehicles();

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-heading">Financials</h1>
          <p className="text-muted-foreground mt-1">Track fuel consumption and operational expenses.</p>
        </div>
        <div className="flex gap-4">
          <a href="/api/export/financials" download>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" /> Export CSV
            </Button>
          </a>
          <AddFuelLogDialog vehicles={vehicles} />
          <AddExpenseDialog vehicles={vehicles} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Fuel Logs</CardTitle>
            <CardDescription>Recent fuel purchases across the fleet.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Volume</TableHead>
                    <TableHead>Cost</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fuelLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground h-24">
                        No fuel logs found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    fuelLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-medium">
                          {new Date(log.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{log.vehicleName}</TableCell>
                        <TableCell>{log.liters} L</TableCell>
                        <TableCell>${log.cost.toFixed(2)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Other Expenses</CardTitle>
            <CardDescription>Tolls, fines, parts, and miscellaneous costs.</CardDescription>
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground h-24">
                        No expenses found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    expenses.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell className="font-medium">
                          {new Date(expense.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{expense.vehicleName}</TableCell>
                        <TableCell className="max-w-[150px] truncate">{expense.description}</TableCell>
                        <TableCell>${expense.cost.toFixed(2)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

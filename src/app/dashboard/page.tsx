import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getFleetManagerAnalytics, getDriverAnalytics, getSafetyOfficerAnalytics, getFinancialAnalystAnalytics } from "@/actions/analytics";
import { Activity, Car, Users, Wrench, Shield, DollarSign, Route, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";
import { DashboardStaggerWrapper, FadeInCard, FinancialExpenseChart, FleetUtilizationChart } from "@/components/DashboardCharts";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const userRole = session.user.role || "Fleet Manager";
  const userName = session.user.name;

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-extrabold tracking-tight">Welcome back, {userName}</h1>
          <p className="text-muted-foreground mt-1">Here is what's happening with your fleet today.</p>
        </div>
        <div className="px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-medium w-fit">
          Role: {userRole}
        </div>
      </div>
      
      {userRole === "Fleet Manager" && <FleetManagerView />}
      {userRole === "Driver" && <DriverView userName={userName} />}
      {userRole === "Safety Officer" && <SafetyOfficerView />}
      {userRole === "Financial Analyst" && <FinancialAnalystView />}
      {!["Fleet Manager", "Driver", "Safety Officer", "Financial Analyst"].includes(userRole) && <FleetManagerView />}
    </div>
  );
}

async function FleetManagerView() {
  const data = await getFleetManagerAnalytics();
  return (
    <DashboardStaggerWrapper>
      <div className="grid gap-6 md:grid-cols-3">
        <FadeInCard>
          <Card className="relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Vehicles</CardTitle>
              <div className="p-2 bg-primary/10 rounded-lg text-primary"><Car className="h-4 w-4" /></div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-extrabold font-heading">{data.totalVehicles}</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-status-success" /> <span className="text-status-success font-medium">+2</span> since last month
              </p>
            </CardContent>
          </Card>
        </FadeInCard>
        
        <FadeInCard>
          <Card className="relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-status-info/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Drivers</CardTitle>
              <div className="p-2 bg-status-info/10 rounded-lg text-status-info"><Users className="h-4 w-4" /></div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-extrabold font-heading">{data.totalDrivers}</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-status-success" /> All available for dispatch
              </p>
            </CardContent>
          </Card>
        </FadeInCard>

        <FadeInCard>
          <Card className="relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-status-success/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Trips</CardTitle>
              <div className="p-2 bg-status-success/10 rounded-lg text-status-success"><Activity className="h-4 w-4" /></div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-extrabold font-heading">{data.activeTrips}</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <Route className="w-3 h-3" /> In transit right now
              </p>
            </CardContent>
          </Card>
        </FadeInCard>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mt-6">
        <FadeInCard>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Fleet Utilization</CardTitle>
            </CardHeader>
            <CardContent>
              <FleetUtilizationChart active={data.activeTrips} total={data.totalVehicles} />
            </CardContent>
          </Card>
        </FadeInCard>
        <FadeInCard>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex items-start gap-4 relative">
                  {i !== 2 && <div className="absolute left-4 top-10 bottom-[-2rem] w-px bg-border"></div>}
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0 z-10">
                    <Route className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Trip dispatched to NY Hub</p>
                    <p className="text-xs text-muted-foreground">2 hours ago • Vehicle Volvo FH16</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </FadeInCard>
      </div>
    </DashboardStaggerWrapper>
  );
}

async function DriverView({ userName }: { userName: string }) {
  const data = await getDriverAnalytics(userName);
  
  if (!data.driverExists) {
    redirect("/onboarding/driver");
  }

  return (
    <DashboardStaggerWrapper>
      <div className="flex items-center justify-between mt-4">
        <h2 className="text-xl font-heading font-semibold">Your Assigned Trips</h2>
      </div>
      
      {data.myTrips.length === 0 ? (
        <FadeInCard>
          <Card className="border-dashed border-2 bg-transparent shadow-none">
            <CardContent className="p-12 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">You're all caught up</h3>
              <p className="text-muted-foreground mt-1">You have no active or past trips assigned at the moment.</p>
            </CardContent>
          </Card>
        </FadeInCard>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.myTrips.map((trip) => (
            <FadeInCard key={trip.id}>
              <Card className="group hover:border-primary/50 transition-colors">
                <CardHeader className="pb-4 border-b border-border/50">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Route</p>
                      <CardTitle className="text-lg font-heading flex flex-col gap-1">
                        <span>{trip.source}</span>
                        <span className="text-muted-foreground text-sm flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-border"></div>
                          <div className="w-1 h-1 rounded-full bg-border"></div>
                          <div className="w-1 h-1 rounded-full bg-border"></div>
                        </span>
                        <span>{trip.destination}</span>
                      </CardTitle>
                    </div>
                    <div className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                      trip.status === 'Completed' ? 'bg-status-success/10 text-status-success border border-status-success/20' : 
                      'bg-primary/10 text-primary border border-primary/20'
                    }`}>
                      {trip.status}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Vehicle</span>
                    <span className="font-medium">{trip.vehicleName}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Distance</span>
                    <span className="font-medium">{trip.plannedDistance} km</span>
                  </div>
                </CardContent>
              </Card>
            </FadeInCard>
          ))}
        </div>
      )}
    </DashboardStaggerWrapper>
  );
}

async function SafetyOfficerView() {
  const data = await getSafetyOfficerAnalytics();
  return (
    <DashboardStaggerWrapper>
      <div className="grid gap-6 md:grid-cols-2">
        <FadeInCard>
          <Card className="border-status-warning/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Open Maintenance Logs</CardTitle>
              <div className="p-2 bg-status-warning/10 rounded-lg text-status-warning"><Wrench className="h-4 w-4" /></div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-extrabold font-heading text-status-warning">{data.openMaintenance}</div>
              <p className="text-xs text-muted-foreground mt-2">Requires immediate attention</p>
            </CardContent>
          </Card>
        </FadeInCard>
        <FadeInCard>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Average Driver Safety Score</CardTitle>
              <div className="p-2 bg-status-success/10 rounded-lg text-status-success"><Shield className="h-4 w-4" /></div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-extrabold font-heading">{data.avgSafetyScore.toFixed(0)}<span className="text-xl text-muted-foreground">/100</span></div>
              <div className="w-full h-2 bg-secondary rounded-full mt-4 overflow-hidden">
                <div className="h-full bg-status-success rounded-full" style={{ width: `${data.avgSafetyScore}%` }}></div>
              </div>
            </CardContent>
          </Card>
        </FadeInCard>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 mt-6">
        <FadeInCard>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-status-alert" /> Drivers at Risk (Safety Score &lt; 80)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.atRiskDrivers.length === 0 ? (
                <div className="text-sm text-muted-foreground">All drivers have excellent safety scores.</div>
              ) : (
                <div className="space-y-4">
                  {data.atRiskDrivers.map(driver => (
                    <div key={driver.id} className="flex justify-between items-center p-3 border rounded-lg bg-status-alert/5">
                      <div>
                        <div className="font-semibold">{driver.name}</div>
                        <div className="text-xs text-muted-foreground">{driver.licenseCategory} License</div>
                      </div>
                      <div className="text-xl font-bold text-status-alert">{driver.safetyScore}</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </FadeInCard>
        
        <FadeInCard>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-status-warning" /> License Compliance Issues
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.complianceIssues.length === 0 ? (
                <div className="text-sm text-muted-foreground">No upcoming license expirations.</div>
              ) : (
                <div className="space-y-4">
                  {data.complianceIssues.map(driver => {
                    const isExpired = new Date(driver.licenseExpiryDate) < new Date();
                    return (
                      <div key={driver.id} className={`flex justify-between items-center p-3 border rounded-lg ${isExpired ? 'bg-status-error/10 border-status-error/20' : 'bg-status-warning/10 border-status-warning/20'}`}>
                        <div>
                          <div className="font-semibold">{driver.name}</div>
                          <div className="text-xs text-muted-foreground">Lic: {driver.licenseNumber}</div>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-bold ${isExpired ? 'text-status-error' : 'text-status-warning'}`}>
                            {isExpired ? 'EXPIRED' : 'Expiring Soon'}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(driver.licenseExpiryDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </FadeInCard>
      </div>
    </DashboardStaggerWrapper>
  );
}

async function FinancialAnalystView() {
  const data = await getFinancialAnalystAnalytics();
  const total = data.totalMaintenance + data.totalExpenses;
  
  return (
    <DashboardStaggerWrapper>
      <div className="grid gap-6 md:grid-cols-3">
        <FadeInCard>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Maintenance Costs</CardTitle>
              <div className="p-2 bg-secondary rounded-lg text-muted-foreground"><Wrench className="h-4 w-4" /></div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold font-heading">${data.totalMaintenance.toFixed(2)}</div>
            </CardContent>
          </Card>
        </FadeInCard>
        <FadeInCard>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Other Expenses</CardTitle>
              <div className="p-2 bg-secondary rounded-lg text-muted-foreground"><DollarSign className="h-4 w-4" /></div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold font-heading">${data.totalExpenses.toFixed(2)}</div>
            </CardContent>
          </Card>
        </FadeInCard>
        <FadeInCard>
          <Card className="bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-primary-foreground/80">Total Operating Cost</CardTitle>
              <div className="p-2 bg-black/20 rounded-lg text-white"><Activity className="h-4 w-4" /></div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold font-heading">${total.toFixed(2)}</div>
            </CardContent>
          </Card>
        </FadeInCard>
      </div>

      <div className="mt-6">
        <FadeInCard>
          <Card>
            <CardHeader>
              <CardTitle>Expenditure Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <FinancialExpenseChart maintenance={data.totalMaintenance} expenses={data.totalExpenses} />
            </CardContent>
          </Card>
        </FadeInCard>
      </div>
    </DashboardStaggerWrapper>
  );
}

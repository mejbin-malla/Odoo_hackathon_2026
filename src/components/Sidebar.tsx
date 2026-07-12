"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { 
  LayoutDashboard, 
  Truck, 
  Users, 
  Wrench, 
  LogOut,
  Route,
  DollarSign,
  Settings
} from "lucide-react";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const role = session?.user?.role || "Fleet Manager";

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Vehicles", href: "/dashboard/vehicles", icon: Truck, roles: ["Fleet Manager", "Safety Officer"] },
    { name: "Drivers", href: "/dashboard/drivers", icon: Users, roles: ["Fleet Manager", "Safety Officer"] },
    { name: "Trips", href: "/dashboard/trips", icon: Route, roles: ["Fleet Manager", "Driver", "Financial Analyst"] },
    { name: "Maintenance", href: "/dashboard/maintenance", icon: Wrench, roles: ["Fleet Manager", "Safety Officer", "Financial Analyst"] },
    { name: "Financials", href: "/dashboard/financials", icon: DollarSign, roles: ["Fleet Manager", "Financial Analyst"] },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ].filter(item => !item.roles || item.roles.includes(role));

  return (
    <aside className="w-64 h-screen hidden md:flex flex-col border-r border-border bg-card/40 backdrop-blur-xl relative z-50 transition-all">
      <div className="p-6 h-16 flex items-center mb-4">
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="bg-primary p-2 rounded-xl text-primary-foreground shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform">
            <Truck className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-heading font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            TransitOps
          </h1>
        </Link>
      </div>
      
      <nav className="flex-1 px-4 flex flex-col gap-2 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group ${
                isActive 
                  ? "text-primary font-medium" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {isActive && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary/10 rounded-xl"
                  initial={false}
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              
              <div className={`relative z-10 flex items-center justify-center p-1.5 rounded-lg transition-colors ${
                isActive ? "bg-primary/20 text-primary" : "group-hover:bg-secondary text-muted-foreground group-hover:text-foreground"
              }`}>
                <item.icon className="w-4 h-4" />
              </div>
              
              <span className="relative z-10">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <div className="bg-secondary/50 rounded-2xl p-4 border border-border/50 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <p className="text-xs text-muted-foreground mb-1 relative z-10">Logged in as</p>
          <p className="text-sm font-semibold text-foreground mb-4 truncate relative z-10">{session?.user?.name || "User"}</p>
          <div className="space-y-2 relative z-10">
            <ThemeToggle />
            <button 
              onClick={handleSignOut} 
              className="flex items-center justify-center gap-2 w-full px-3 h-10 text-xs font-medium bg-background hover:bg-destructive hover:text-destructive-foreground hover:border-destructive text-foreground border border-border rounded-lg transition-all shadow-sm group"
            >
              <LogOut className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

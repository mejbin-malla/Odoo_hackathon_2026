"use client";

import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import { authClient } from "@/lib/auth-client";

export function Topbar() {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const name = session?.user?.name || "A";
  
  // Create breadcrumbs from pathname
  const paths = pathname.split('/').filter(Boolean);
  const title = paths.length > 1 
    ? paths[paths.length - 1].charAt(0).toUpperCase() + paths[paths.length - 1].slice(1)
    : "Overview";

  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="text-xl font-semibold font-heading text-foreground">{title}</h2>
          <p className="text-xs text-muted-foreground hidden sm:block">
            Dashboard {paths.length > 1 ? `/ ${title}` : ""}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-5">

        <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold shadow-inner">
          {name.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}

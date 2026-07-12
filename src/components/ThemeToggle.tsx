"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle({ iconOnly = false }: { iconOnly?: boolean }) {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      className={iconOnly 
        ? "h-10 w-10 shrink-0 border-border/50 bg-background hover:bg-secondary rounded-full" 
        : "w-full justify-start gap-2 px-3 h-10 border-border/50 bg-background hover:bg-secondary"}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      {!iconOnly && <span className="font-medium text-xs ml-6">Toggle Theme</span>}
    </Button>
  );
}

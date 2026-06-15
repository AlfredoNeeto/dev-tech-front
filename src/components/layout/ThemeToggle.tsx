import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/app/theme";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button type="button" variant="outline" className="w-full justify-between" onClick={toggleTheme}>
      <span>{theme === "light" ? "Ativar modo escuro" : "Ativar modo claro"}</span>
      {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
    </Button>
  );
}

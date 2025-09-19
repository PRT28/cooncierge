import type { ReactNode } from "react";
import ConsoleShell from "@/components/ConsoleShell";

interface ConsoleLayoutProps {
  children: ReactNode;
}

export default function ConsoleLayout({ children }: ConsoleLayoutProps) {
  return <ConsoleShell>{children}</ConsoleShell>;
}

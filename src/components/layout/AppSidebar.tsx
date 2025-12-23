import { cn } from "@/lib/utils";
import {
  Home,
  LayoutDashboard,
  CreditCard,
  FileText,
  Users,
  BarChart3,
  Settings,
  HelpCircle,
} from "lucide-react";
import { useState } from "react";

const menuItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: CreditCard, label: "Bank Reconciliation", href: "/reconciliation", active: true },
  { icon: FileText, label: "Transactions", href: "/transactions" },
  { icon: Users, label: "Contacts", href: "/contacts" },
  { icon: BarChart3, label: "Reports", href: "/reports" },
];

const bottomItems = [
  { icon: Settings, label: "Settings", href: "/settings" },
  { icon: HelpCircle, label: "Help & Support", href: "/help" },
];

export const AppSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-sidebar-border">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
          S
        </div>
        {!collapsed && (
          <span className="font-semibold text-lg">SmartRecon</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {menuItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              item.active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </a>
        ))}
      </nav>

      {/* Bottom Navigation */}
      <div className="py-4 px-3 space-y-1 border-t border-sidebar-border">
        {bottomItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </a>
        ))}
      </div>
    </aside>
  );
};

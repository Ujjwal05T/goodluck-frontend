"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  School,
  BookOpen,
  Calendar,
  BarChart3,
  DollarSign,
  MessageSquare,
  Settings,
  FileText,
  Award,
  TrendingUp,
  Database,
  Palette,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navGroups = [
  {
    label: "Overview",
    items: [
      { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Management",
    items: [
      { href: "/admin/team", label: "Sales Team", icon: Users },
      { href: "/admin/tour-plans", label: "Tour Plans", icon: Calendar },
      { href: "/admin/tada", label: "TA/DA Approval", icon: DollarSign },
      { href: "/admin/specimen", label: "Specimen Tracking", icon: BookOpen },
      { href: "/admin/feedback", label: "Feedback Manager", icon: MessageSquare },
    ],
  },
  {
    label: "Analytics",
    items: [
      { href: "/admin/analytics/schools", label: "School Analytics", icon: School },
      { href: "/admin/analytics/prescribed-books", label: "Prescribed Books", icon: FileText },
    ],
  },
  {
    label: "Reports",
    items: [
      { href: "/admin/reports/visits", label: "Visit Reports", icon: BarChart3 },
      { href: "/admin/reports/compliance", label: "Policy Compliance", icon: Award },
      { href: "/admin/reports/loyalty", label: "Loyalty Reports", icon: TrendingUp },
      { href: "/admin/reports/gap-analysis", label: "Gap Analysis", icon: BarChart3 },
    ],
  },
  {
    label: "Settings",
    items: [
      { href: "/admin/settings/dropdowns", label: "Dropdown Manager", icon: Settings },
      { href: "/admin/settings/white-label", label: "White Label", icon: Palette },
      { href: "/admin/erp", label: "ERP Integration", icon: Database },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:border-r lg:bg-background">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/admin/dashboard" className="flex items-center space-x-2">
          <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold">CRM</span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm">Admin Portal</span>
            <span className="text-xs text-muted-foreground">Management</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-6">
        {navGroups.map((group) => (
          <div key={group.label}>
            <h3 className="mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {group.label}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:translate-x-1",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Info */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-medium">GM</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">GM Sales</p>
            <p className="text-xs text-muted-foreground truncate">admin@company.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

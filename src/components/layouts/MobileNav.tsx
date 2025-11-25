"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  School,
  Users,
  DollarSign,
  Bell,
  CheckCircle2,
  Plus,
  Calendar,
  UserCircle,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mobileNavItems = [
  { href: "/salesman/dashboard", label: "Dashboard", icon: Home },
  { href: "/salesman/schools", label: "Schools", icon: School },
  { href: "/salesman/qbs", label: "QBs", icon: BookOpen },
  { href: "/salesman/booksellers", label: "Sellers", icon: Users },
  { href: "/salesman/notifications", label: "Alerts", icon: Bell },
];

const desktopNavItems = [
  { href: "/salesman/dashboard", label: "Dashboard", icon: Home },
  { href: "/salesman/attendance", label: "Attendance", icon: CheckCircle2 },

  { type: "separator", label: "Schools" },
  { href: "/salesman/schools", label: "My Schools", icon: School },
  { href: "/salesman/schools/add-visit", label: "Add School Visit", icon: Plus },
  { href: "/salesman/next-visits", label: "My Visits", icon: Calendar },

  { type: "separator", label: "Question Banks" },
  { href: "/salesman/qbs", label: "My QBs", icon: BookOpen },
  { href: "/salesman/qbs/add-visit", label: "Add QB Visit", icon: Plus },

  { type: "separator", label: "Book Sellers" },
  { href: "/salesman/booksellers", label: "Book Sellers", icon: Users },
  { href: "/salesman/booksellers/add-visit", label: "Add Seller Visit", icon: Plus },

  { type: "separator", label: "Other" },
  { href: "/salesman/contacts", label: "My Contact Persons", icon: UserCircle },
  { href: "/salesman/tada", label: "TA/DA Claims", icon: DollarSign },
  { href: "/salesman/notifications", label: "Notifications", icon: Bell },
] as const;

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <>
      {/* Top Header */}
      {/* <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center px-4">
          <Link href="/salesman/dashboard" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">CRM</span>
            </div>
            <span className="font-semibold hidden sm:inline-block">Field App</span>
          </Link>

          <div className="ml-auto flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header> */}

      {/* Bottom Navigation - Mobile Only */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden">
        <div className="grid grid-cols-5 gap-1 p-2">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 rounded-md p-2 text-xs transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[10px]">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop Sidebar - Hidden on Mobile */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:border-r md:bg-background">
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/salesman/dashboard" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">CRM</span>
            </div>
            <span className="font-semibold">Field App</span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {desktopNavItems.map((item, index) => {
              // Render separator
              if ('type' in item && item.type === 'separator') {
                return (
                  <div key={`separator-${index}`} className="pt-4 pb-2">
                    <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {item.label}
                    </p>
                  </div>
                );
              }

              // Render nav link
              if ('href' in item && item.href) {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              }

              return null;
            })}
          </div>
        </nav>
      </aside>
    </>
  );
}

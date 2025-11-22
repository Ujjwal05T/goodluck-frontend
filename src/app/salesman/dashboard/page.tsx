"use client";

import { useEffect, useState } from "react";
import { Target, BookOpen, CheckCircle2, Calendar, AlertCircle } from "lucide-react";
import PageContainer from "@/components/layouts/PageContainer";
import PageHeader from "@/components/layouts/PageHeader";
import StatsCard from "@/components/dashboard/StatsCard";
import ProgressCard from "@/components/dashboard/ProgressCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatsCardSkeleton, DashboardSkeleton } from "@/components/ui/skeleton-loaders";
import Link from "next/link";

// Import mock data
import salesmenData from "@/lib/mock-data/salesmen.json";
import notificationsData from "@/lib/mock-data/notifications.json";
import visitsData from "@/lib/mock-data/visits.json";
import schoolsData from "@/lib/mock-data/schools.json";

export default function SalesmanDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [salesmanData, setSalesmanData] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [visitStats, setVisitStats] = useState({
    schoolVisitsToday: 0,
    bookSellerVisitsToday: 0,
    pendingNextVisits: 0,
  });
  const [schoolStats, setSchoolStats] = useState({
    visitedTwice: 0,
    yetToVisit: 0,
    total: 120,
  });

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      // Get salesman data (using first salesman as example)
      const salesman = salesmenData[0];
      setSalesmanData(salesman);

      // Get unread notifications
      const userNotifications = notificationsData
        .filter((n) => n.userId === salesman.id && !n.read)
        .slice(0, 5);
      setAlerts(userNotifications);

      // Calculate visit stats (mock data)
      const today = new Date().toISOString().split("T")[0];
      const todayVisits = visitsData.filter(
        (v) => v.salesmanId === salesman.id && v.date.startsWith("2025-11")
      );

      setVisitStats({
        schoolVisitsToday: todayVisits.filter((v) => v.type === "school").length,
        bookSellerVisitsToday: todayVisits.filter((v) => v.type === "bookseller").length,
        pendingNextVisits: visitsData.filter(
          (v) => v.status === "Scheduled" && v.salesmanId === salesman.id
        ).length,
      });

      // Calculate school stats
      const assignedSchools = schoolsData.filter((s) => s.assignedTo === salesman.id);
      setSchoolStats({
        visitedTwice: assignedSchools.filter((s) => s.visitCount >= 2).length,
        yetToVisit: assignedSchools.filter((s) => s.visitCount === 0).length,
        total: assignedSchools.length,
      });

      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <PageContainer>
        <DashboardSkeleton />
      </PageContainer>
    );
  }

  const salesPercentage = Math.round((salesmanData.salesAchieved / salesmanData.salesTarget) * 100);
  const specimenPercentage = Math.round((salesmanData.specimenUsed / salesmanData.specimenBudget) * 100);

  return (
    <PageContainer>
      <PageHeader
        title="Dashboard"
        description={`Welcome back, ${salesmanData.name}!`}
      />

      {/* Top Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatsCard
          title="Sales Target"
          value={`₹${(salesmanData.salesAchieved / 100000).toFixed(1)}L`}
          description={`Target: ₹${(salesmanData.salesTarget / 100000).toFixed(1)}L`}
          icon={Target}
        />
        <StatsCard
          title="Achievement"
          value={`${salesPercentage}%`}
          description={`₹${((salesmanData.salesTarget - salesmanData.salesAchieved) / 100000).toFixed(1)}L remaining`}
          icon={CheckCircle2}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="School Visits"
          value={visitStats.schoolVisitsToday}
          description="Today's visits"
          icon={BookOpen}
        />
        <StatsCard
          title="Pending Visits"
          value={visitStats.pendingNextVisits}
          description="Scheduled upcoming"
          icon={Calendar}
        />
      </div>

      {/* Progress Cards */}
      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <ProgressCard
          title="Specimen Budget"
          current={salesmanData.specimenUsed}
          total={salesmanData.specimenBudget}
          unit="₹"
          description={`${specimenPercentage}% of budget utilized`}
        />
        <ProgressCard
          title="School Coverage"
          current={schoolStats.visitedTwice}
          total={schoolStats.total}
          description={`${schoolStats.yetToVisit} schools yet to visit`}
        />
      </div>

      {/* Visit Summary & Alerts */}
      <div className="grid gap-4 md:grid-cols-2 mb-6">
        {/* Visit Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Today's Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p className="text-sm text-muted-foreground">School Visits</p>
                <p className="text-2xl font-bold">{visitStats.schoolVisitsToday}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p className="text-sm text-muted-foreground">Bookseller Visits</p>
                <p className="text-2xl font-bold">{visitStats.bookSellerVisitsToday}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-blue-600" />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p className="text-sm text-muted-foreground">Pending Next Visits</p>
                <p className="text-2xl font-bold">{visitStats.pendingNextVisits}</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Alerts</CardTitle>
            <Link href="/salesman/notifications">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {alerts.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No new alerts
              </p>
            ) : (
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <AlertCircle
                      className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                        alert.priority === "high"
                          ? "text-red-600"
                          : alert.priority === "medium"
                          ? "text-orange-600"
                          : "text-blue-600"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{alert.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {alert.message}
                      </p>
                    </div>
                    <Badge
                      variant={alert.priority === "high" ? "destructive" : "secondary"}
                      className="text-xs"
                    >
                      {alert.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link href="/salesman/schools/add-visit">
              <Button variant="outline" className="w-full h-auto flex-col py-4">
                <BookOpen className="h-5 w-5 mb-2" />
                <span className="text-sm">Add Visit</span>
              </Button>
            </Link>
            <Link href="/salesman/attendance">
              <Button variant="outline" className="w-full h-auto flex-col py-4">
                <CheckCircle2 className="h-5 w-5 mb-2" />
                <span className="text-sm">Attendance</span>
              </Button>
            </Link>
            <Link href="/salesman/schools">
              <Button variant="outline" className="w-full h-auto flex-col py-4">
                <Target className="h-5 w-5 mb-2" />
                <span className="text-sm">My Schools</span>
              </Button>
            </Link>
            <Link href="/salesman/tada">
              <Button variant="outline" className="w-full h-auto flex-col py-4">
                <Calendar className="h-5 w-5 mb-2" />
                <span className="text-sm">TA/DA</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}

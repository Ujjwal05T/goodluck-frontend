"use client";

import { useEffect, useState } from "react";
import { Users, School, BookOpen, DollarSign, TrendingUp, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import PageContainer from "@/components/layouts/PageContainer";
import PageHeader from "@/components/layouts/PageHeader";
import StatsCard from "@/components/dashboard/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardSkeleton } from "@/components/ui/skeleton-loaders";

// Import mock data
import salesmenData from "@/lib/mock-data/salesmen.json";
import schoolsData from "@/lib/mock-data/schools.json";
import visitsData from "@/lib/mock-data/visits.json";
import tadaClaimsData from "@/lib/mock-data/tada-claims.json";
import feedbackData from "@/lib/mock-data/feedback.json";

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSalesmen: 0,
    totalSchools: 0,
    visitsToday: 0,
    pendingTADA: 0,
    totalSpecimenBudget: 0,
    specimenUsed: 0,
    pattakatSchools: 0,
    pendingFeedback: 0,
  });

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      const today = new Date().toISOString().split("T")[0];
      const todayVisits = visitsData.filter((v) => v.date.startsWith("2025-11"));

      setStats({
        totalSalesmen: salesmenData.length,
        totalSchools: schoolsData.length,
        visitsToday: todayVisits.length,
        pendingTADA: tadaClaimsData.filter((t) => t.status === "Pending").length,
        totalSpecimenBudget: salesmenData.reduce((sum, s) => sum + s.specimenBudget, 0),
        specimenUsed: salesmenData.reduce((sum, s) => sum + s.specimenUsed, 0),
        pattakatSchools: schoolsData.filter((s) => s.isPattakat).length,
        pendingFeedback: feedbackData.filter((f) => f.status === "Pending").length,
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

  const specimenUtilization = Math.round((stats.specimenUsed / stats.totalSpecimenBudget) * 100);

  return (
    <PageContainer>
      <PageHeader
        title="Admin Dashboard"
        description="Overview of CRM operations and performance"
      />

      {/* Top Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatsCard
          title="Sales Team"
          value={stats.totalSalesmen}
          description="Active salesmen"
          icon={Users}
        />
        <StatsCard
          title="Total Schools"
          value={stats.totalSchools}
          description={`${stats.pattakatSchools} Pattakat schools`}
          icon={School}
        />
        <StatsCard
          title="Visits Today"
          value={stats.visitsToday}
          description="School & bookseller visits"
          icon={CheckCircle2}
          trend={{ value: 15, isPositive: true }}
        />
        <StatsCard
          title="Pending TA/DA"
          value={stats.pendingTADA}
          description="Awaiting approval"
          icon={DollarSign}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Specimen Budget</p>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold mb-1">
              ₹{(stats.totalSpecimenBudget / 100000).toFixed(1)}L
            </p>
            <p className="text-xs text-muted-foreground">
              {specimenUtilization}% utilized (₹{(stats.specimenUsed / 100000).toFixed(1)}L)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Pattakat Schools</p>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold mb-1">{stats.pattakatSchools}</p>
            <p className="text-xs text-muted-foreground">
              {((stats.pattakatSchools / stats.totalSchools) * 100).toFixed(1)}% of total schools
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Pending Feedback</p>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold mb-1">{stats.pendingFeedback}</p>
            <p className="text-xs text-muted-foreground">Awaiting PM response</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <div className="grid gap-4 md:grid-cols-2 mb-6">
        {/* Recent TA/DA Claims */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent TA/DA Claims</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tadaClaimsData.slice(0, 5).map((claim) => (
                <div key={claim.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium">{claim.salesmanName}</p>
                    <p className="text-sm text-muted-foreground">
                      ₹{claim.amount.toLocaleString()} - {claim.city}
                    </p>
                  </div>
                  <Badge
                    variant={
                      claim.status === "Approved"
                        ? "default"
                        : claim.status === "Rejected"
                        ? "destructive"
                        : claim.status === "Flagged"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {claim.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Feedback */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {feedbackData.slice(0, 5).map((feedback) => (
                <div key={feedback.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{feedback.schoolName}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {feedback.category} - {feedback.salesmanName}
                    </p>
                  </div>
                  <Badge
                    variant={
                      feedback.status === "Resolved"
                        ? "default"
                        : feedback.status === "Pending"
                        ? "secondary"
                        : "outline"
                    }
                    className="ml-2"
                  >
                    {feedback.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Salesman Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Salesman Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {salesmenData.map((salesman) => {
              const achievement = Math.round((salesman.salesAchieved / salesman.salesTarget) * 100);
              return (
                <div key={salesman.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex-1">
                    <p className="font-medium">{salesman.name}</p>
                    <p className="text-sm text-muted-foreground">{salesman.region} - {salesman.state}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={achievement >= 75 ? "default" : achievement >= 50 ? "secondary" : "destructive"}>
                      {achievement}%
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      ₹{(salesman.salesAchieved / 100000).toFixed(1)}L / ₹{(salesman.salesTarget / 100000).toFixed(1)}L
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}

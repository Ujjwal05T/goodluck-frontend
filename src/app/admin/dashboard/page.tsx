"use client";

import { useEffect, useState } from "react";
import { Users, School, BookOpen, DollarSign, TrendingUp, CheckCircle2, AlertCircle, Clock, BarChart3, PieChart as PieChartIcon } from "lucide-react";
import PageContainer from "@/components/layouts/PageContainer";
import PageHeader from "@/components/layouts/PageHeader";
import StatsCard from "@/components/dashboard/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardSkeleton } from "@/components/ui/skeleton-loaders";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Import mock data
import salesmenData from "@/lib/mock-data/salesmen.json";
import schoolsData from "@/lib/mock-data/schools.json";
import visitsData from "@/lib/mock-data/visits.json";
import tadaClaimsData from "@/lib/mock-data/tada-claims.json";
import feedbackData from "@/lib/mock-data/feedback.json";

// Colors for charts
const COLORS = {
  primary: "#3b82f6",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  purple: "#8b5cf6",
  cyan: "#06b6d4",
  indigo: "#6366f1",
  pink: "#ec4899",
};

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

  // Chart data states
  const [teamPerformance, setTeamPerformance] = useState<any[]>([]);
  const [visitTrends, setVisitTrends] = useState<any[]>([]);
  const [schoolDistribution, setSchoolDistribution] = useState<any[]>([]);
  const [specimenUtilizationData, setSpecimenUtilizationData] = useState<any[]>([]);
  const [tadaStatusData, setTadaStatusData] = useState<any[]>([]);

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

      // Team Performance Chart Data
      const performanceData = salesmenData.map((salesman) => ({
        name: salesman.name.split(" ")[0], // First name only for cleaner display
        achieved: salesman.salesAchieved,
        target: salesman.salesTarget,
        achievement: Math.round((salesman.salesAchieved / salesman.salesTarget) * 100),
      }));
      setTeamPerformance(performanceData);

      // Visit Trends (Last 7 days)
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      const trendsData = days.map((day, index) => ({
        day,
        schools: Math.floor(Math.random() * 15) + 5,
        booksellers: Math.floor(Math.random() * 8) + 2,
        total: 0,
      }));
      trendsData.forEach(item => {
        item.total = item.schools + item.booksellers;
      });
      setVisitTrends(trendsData);

      // School Distribution
      const pattakat = schoolsData.filter((s) => s.isPattakat).length;
      const regular = schoolsData.length - pattakat;
      setSchoolDistribution([
        { name: "Pattakat Schools", value: pattakat, color: COLORS.success },
        { name: "Regular Schools", value: regular, color: COLORS.primary },
      ]);

      // Specimen Utilization by Salesman
      const utilizationData = salesmenData.map((salesman) => ({
        name: salesman.name.split(" ")[0],
        used: salesman.specimenUsed,
        remaining: salesman.specimenBudget - salesman.specimenUsed,
        utilization: Math.round((salesman.specimenUsed / salesman.specimenBudget) * 100),
      }));
      setSpecimenUtilizationData(utilizationData);

      // TA/DA Status Distribution
      const pendingCount = tadaClaimsData.filter((t) => t.status === "Pending").length;
      const approvedCount = tadaClaimsData.filter((t) => t.status === "Approved").length;
      const rejectedCount = tadaClaimsData.filter((t) => t.status === "Rejected").length;
      const flaggedCount = tadaClaimsData.filter((t) => t.status === "Flagged").length;

      setTadaStatusData([
        { name: "Approved", value: approvedCount, color: COLORS.success },
        { name: "Pending", value: pendingCount, color: COLORS.warning },
        { name: "Flagged", value: flaggedCount, color: COLORS.danger },
        { name: "Rejected", value: rejectedCount, color: COLORS.danger },
      ].filter(item => item.value > 0));

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

      {/* Team Performance Chart - Bar Chart */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Team Sales Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={teamPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`} />
              <Tooltip
                formatter={(value: any) => [`₹${(value / 100000).toFixed(2)}L`, ""]}
                labelStyle={{ color: "#000" }}
              />
              <Legend />
              <Bar dataKey="achieved" fill={COLORS.success} name="Achieved" />
              <Bar dataKey="target" fill={COLORS.primary} name="Target" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Charts Row 1 */}
      <div className="grid gap-4 md:grid-cols-2 mb-6">
        {/* Visit Trends - Line Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Visit Trends (Last 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={visitTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="schools"
                  stroke={COLORS.primary}
                  strokeWidth={2}
                  name="School Visits"
                />
                <Line
                  type="monotone"
                  dataKey="booksellers"
                  stroke={COLORS.success}
                  strokeWidth={2}
                  name="Bookseller Visits"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* School Distribution - Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <PieChartIcon className="h-5 w-5" />
              School Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={schoolDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${((percent as number)* 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {schoolDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {schoolDistribution.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-semibold">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-4 md:grid-cols-2 mb-6">
        {/* Specimen Utilization - Area Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Specimen Budget Utilization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={specimenUtilizationData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tickFormatter={(value) => `${value}%`} />
                <YAxis dataKey="name" type="category" width={60} />
                <Tooltip formatter={(value: any) => [`${value}%`, "Utilization"]} />
                <Bar dataKey="utilization" fill={COLORS.purple} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* TA/DA Status - Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              TA/DA Claims Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={tadaStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${((percent as number)* 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {tadaStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {tadaStatusData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-semibold">{item.value}</span>
                </div>
              ))}
            </div>
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

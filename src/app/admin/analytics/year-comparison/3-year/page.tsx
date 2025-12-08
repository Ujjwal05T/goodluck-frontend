"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Minus, Award, School, Download } from "lucide-react";
import PageContainer from "@/components/layouts/PageContainer";
import PageHeader from "@/components/layouts/PageHeader";
import StatsCard from "@/components/dashboard/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DashboardSkeleton } from "@/components/ui/skeleton-loaders";
import { toast } from "sonner";

// Import mock data
import schoolsData from "@/lib/mock-data/schools.json";

interface ThreeYearData {
  id: string;
  name: string;
  city: string;
  state: string;
  board: string;
  strength: number;
  assignedTo: string;
  sales2023: number;
  sales2024: number;
  sales2025: number;
  totalSales: number;
  growth: number;
  trend: "up" | "stable" | "down";
}

export default function ThreeYearComparisonPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [stateFilter, setStateFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [salesmanFilter, setSalesmanFilter] = useState("all");
  const [schools, setSchools] = useState<ThreeYearData[]>([]);
  const [filteredSchools, setFilteredSchools] = useState<ThreeYearData[]>([]);

  // Derive state from city (mock mapping)
  const stateMap: Record<string, string> = {
    Delhi: "Delhi",
    Mumbai: "Maharashtra",
    Ahmedabad: "Gujarat",
    Jaipur: "Rajasthan",
    Hyderabad: "Telangana",
    Bangalore: "Karnataka",
    Pune: "Maharashtra",
  };

  useEffect(() => {
    setTimeout(() => {
      const threeYearSchools: ThreeYearData[] = [];

      schoolsData.forEach((school) => {
        const sales2023 = school.businessHistory.find((h) => h.year === 2023)?.revenue || 0;
        const sales2024 = school.businessHistory.find((h) => h.year === 2024)?.revenue || 0;
        const sales2025 = school.businessHistory.find((h) => h.year === 2025)?.revenue || 0;
        const yearsActive = school.businessHistory.filter((h) => h.revenue > 0).length;

        if (yearsActive === 3) {
          const totalSales = sales2023 + sales2024 + sales2025;
          const growth = sales2023 > 0 ? ((sales2025 - sales2023) / sales2023) * 100 : 0;

          let trend: "up" | "stable" | "down" = "stable";
          if (growth > 10) trend = "up";
          else if (growth < -10) trend = "down";

          threeYearSchools.push({
            id: school.id,
            name: school.name,
            city: school.city,
            state: stateMap[school.city] || "Unknown",
            board: school.board,
            strength: school.strength,
            assignedTo: school.assignedTo,
            sales2023,
            sales2024,
            sales2025,
            totalSales,
            growth,
            trend,
          });
        }
      });

      const sorted = threeYearSchools.sort((a, b) => b.totalSales - a.totalSales);
      setSchools(sorted);
      setFilteredSchools(sorted);
      setIsLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    let filtered = schools;

    if (stateFilter !== "all") {
      filtered = filtered.filter((s) => s.state === stateFilter);
    }

    if (cityFilter !== "all") {
      filtered = filtered.filter((s) => s.city === cityFilter);
    }

    if (salesmanFilter !== "all") {
      filtered = filtered.filter((s) => s.assignedTo === salesmanFilter);
    }

    setFilteredSchools(filtered);
  }, [schools, stateFilter, cityFilter, salesmanFilter]);

  if (isLoading) {
    return (
      <PageContainer>
        <DashboardSkeleton />
      </PageContainer>
    );
  }

  // Get unique values for filters
  const states = Array.from(new Set(schools.map((s) => s.state))).sort();
  const cities = Array.from(new Set(schools.map((s) => s.city))).sort();
  const salesmen = Array.from(new Set(schools.map((s) => s.assignedTo))).sort();

  const totalSales = filteredSchools.reduce((sum, s) => sum + s.totalSales, 0);
  const avgGrowth = filteredSchools.length > 0
    ? filteredSchools.reduce((sum, s) => sum + s.growth, 0) / filteredSchools.length
    : 0;

  const handleExport = () => {
    toast.success("Exporting 3-year comparison data to Excel...");
  };

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (trend === "down") return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-blue-600" />;
  };

  const getTrendBadge = (trend: string) => {
    if (trend === "up") return <Badge variant="secondary" className="bg-green-100 text-green-700">Growing</Badge>;
    if (trend === "down") return <Badge variant="secondary" className="bg-red-100 text-red-700">Declining</Badge>;
    return <Badge variant="secondary">Stable</Badge>;
  };

  return (
    <PageContainer>
      <PageHeader
        title="3-Year User Comparison (2022-23, 2023-24 & 2024-25)"
        description="Schools with business across all 3 years"
      />

      {/* Top Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <StatsCard
          title="Total 3-Year Schools"
          value={schools.length}
          description="Loyal customers"
          icon={Award}
        />
        <StatsCard
          title="Filtered Results"
          value={filteredSchools.length}
          description="Matching criteria"
          icon={School}
        />
        <StatsCard
          title="Total Sales (3 Years)"
          value={`₹${totalSales.toLocaleString()}`}
          description="Combined revenue"
          icon={TrendingUp}
        />
        <StatsCard
          title="Avg Growth"
          value={`${avgGrowth > 0 ? "+" : ""}${avgGrowth.toFixed(1)}%`}
          description="3-Year trend"
          icon={TrendingUp}
        />
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select value={stateFilter} onValueChange={setStateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All States" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                {states.map((state) => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={cityFilter} onValueChange={setCityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Cities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={salesmanFilter} onValueChange={setSalesmanFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Salesmen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Salesmen</SelectItem>
                {salesmen.map((salesman) => (
                  <SelectItem key={salesman} value={salesman}>{salesman}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button onClick={handleExport} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export to Excel
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Schools Table */}
      <Card>
        <CardHeader>
          <CardTitle>3-Year User Schools ({filteredSchools.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>S.No</TableHead>
                  <TableHead>School Name</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Strength</TableHead>
                  <TableHead>Board</TableHead>
                  <TableHead>Sales (22-23)</TableHead>
                  <TableHead>Sales (23-24)</TableHead>
                  <TableHead>Sales (24-25)</TableHead>
                  <TableHead>Total Sales</TableHead>
                  <TableHead>Growth %</TableHead>
                  <TableHead>Trend</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSchools.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center py-8 text-muted-foreground">
                      No 3-year schools found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSchools.map((school, index) => (
                    <TableRow key={school.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <School className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{school.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{school.city}</TableCell>
                      <TableCell>{school.strength.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{school.board}</Badge>
                      </TableCell>
                      <TableCell>
                        ₹{school.sales2023.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        ₹{school.sales2024.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        ₹{school.sales2025.toLocaleString()}
                      </TableCell>
                      <TableCell className="font-bold">
                        ₹{school.totalSales.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {getTrendIcon(school.trend)}
                          <span className={`font-medium ${
                            school.growth > 0 ? "text-green-600" :
                            school.growth < 0 ? "text-red-600" : "text-muted-foreground"
                          }`}>
                            {school.growth > 0 ? "+" : ""}
                            {school.growth.toFixed(1)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{getTrendBadge(school.trend)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}

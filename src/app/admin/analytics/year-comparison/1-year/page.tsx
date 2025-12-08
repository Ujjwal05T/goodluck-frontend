"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Calendar, School, Download } from "lucide-react";
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

interface OneYearData {
  id: string;
  name: string;
  city: string;
  state: string;
  board: string;
  strength: number;
  assignedTo: string;
  sales2025: number;
}

export default function OneYearComparisonPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [stateFilter, setStateFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [salesmanFilter, setSalesmanFilter] = useState("all");
  const [schools, setSchools] = useState<OneYearData[]>([]);
  const [filteredSchools, setFilteredSchools] = useState<OneYearData[]>([]);

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
      const oneYearSchools: OneYearData[] = [];

      schoolsData.forEach((school) => {
        const sales2025 = school.businessHistory.find((h) => h.year === 2025)?.revenue || 0;
        const yearsActive = school.businessHistory.filter((h) => h.revenue > 0).length;

        if (yearsActive === 1 && sales2025 > 0) {
          oneYearSchools.push({
            id: school.id,
            name: school.name,
            city: school.city,
            state: stateMap[school.city] || "Unknown",
            board: school.board,
            strength: school.strength,
            assignedTo: school.assignedTo,
            sales2025,
          });
        }
      });

      const sorted = oneYearSchools.sort((a, b) => b.sales2025 - a.sales2025);
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

  const totalSales = filteredSchools.reduce((sum, s) => sum + s.sales2025, 0);

  const handleExport = () => {
    toast.success("Exporting 1-year comparison data to Excel...");
  };

  return (
    <PageContainer>
      <PageHeader
        title="1-Year User Comparison (2024-25)"
        description="Schools with business in the current year only"
      />

      {/* Top Stats */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <StatsCard
          title="Total 1-Year Schools"
          value={schools.length}
          description="New customers"
          icon={Calendar}
        />
        <StatsCard
          title="Filtered Results"
          value={filteredSchools.length}
          description="Matching criteria"
          icon={School}
        />
        <StatsCard
          title="Total Sales (24-25)"
          value={`₹${totalSales.toLocaleString()}`}
          description="Current year revenue"
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
          <CardTitle>1-Year User Schools ({filteredSchools.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>S.No</TableHead>
                  <TableHead>School Name</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Strength</TableHead>
                  <TableHead>Board</TableHead>
                  <TableHead>Sales (24-25)</TableHead>
                  <TableHead>Assigned To</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSchools.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No 1-year schools found matching your criteria
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
                      <TableCell>{school.state}</TableCell>
                      <TableCell>{school.strength.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{school.board}</Badge>
                      </TableCell>
                      <TableCell className="font-bold">
                        ₹{school.sales2025.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{school.assignedTo}</Badge>
                      </TableCell>
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

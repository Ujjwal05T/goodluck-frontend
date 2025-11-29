"use client";

import { useState, useMemo } from "react";
import { Search, TrendingUp, TrendingDown, Minus, Award, Calendar, School, Download, Eye, ChevronDown, ChevronUp } from "lucide-react";
import PageContainer from "@/components/layouts/PageContainer";
import PageHeader from "@/components/layouts/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

// Import mock data
import schoolsData from "@/lib/mock-data/schools.json";

interface YearComparisonData {
  id: string;
  name: string;
  city: string;
  state: string;
  board: string;
  strength: number;
  assignedTo: string;
  sales1Year: number;
  sales2Year: number;
  sales3Year: number;
  revenue2023: number;
  revenue2024: number;
  revenue2025: number;
  growth1to2: number;
  growth2to3: number;
  overallGrowth: number;
  trend: "up" | "stable" | "down";
  yearsActive: number;
}

export default function YearComparisonPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [stateFilter, setStateFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [salesmanFilter, setSalesmanFilter] = useState("all");
  const [trendFilter, setTrendFilter] = useState("all");
  const [sortField, setSortField] = useState<keyof YearComparisonData>("sales3Year");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Process school data
  const comparisonData = useMemo<YearComparisonData[]>(() => {
    return schoolsData.map((school) => {
      const revenue2023 = school.businessHistory.find((h) => h.year === 2023)?.revenue || 0;
      const revenue2024 = school.businessHistory.find((h) => h.year === 2024)?.revenue || 0;
      const revenue2025 = school.businessHistory.find((h) => h.year === 2025)?.revenue || 0;

      const sales1Year = revenue2025;
      const sales2Year = revenue2024 + revenue2025;
      const sales3Year = revenue2023 + revenue2024 + revenue2025;

      const growth1to2 = revenue2024 > 0 ? ((revenue2025 - revenue2024) / revenue2024) * 100 : 0;
      const growth2to3 = revenue2023 > 0 ? ((sales2Year - revenue2023) / revenue2023) * 100 : 0;
      const overallGrowth = revenue2023 > 0 ? ((revenue2025 - revenue2023) / revenue2023) * 100 : 0;

      let trend: "up" | "stable" | "down" = "stable";
      if (overallGrowth > 10) trend = "up";
      else if (overallGrowth < -10) trend = "down";

      const yearsActive = school.businessHistory.filter((h) => h.revenue > 0).length;

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

      return {
        id: school.id,
        name: school.name,
        city: school.city,
        state: stateMap[school.city] || "Unknown",
        board: school.board,
        strength: school.strength,
        assignedTo: school.assignedTo,
        sales1Year,
        sales2Year,
        sales3Year,
        revenue2023,
        revenue2024,
        revenue2025,
        growth1to2,
        growth2to3,
        overallGrowth,
        trend,
        yearsActive,
      };
    });
  }, []);

  // Apply filters and search
  const filteredData = useMemo(() => {
    let filtered = comparisonData;

    // Search
    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.state.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // State filter
    if (stateFilter !== "all") {
      filtered = filtered.filter((item) => item.state === stateFilter);
    }

    // City filter
    if (cityFilter !== "all") {
      filtered = filtered.filter((item) => item.city === cityFilter);
    }

    // Salesman filter
    if (salesmanFilter !== "all") {
      filtered = filtered.filter((item) => item.assignedTo === salesmanFilter);
    }

    // Trend filter
    if (trendFilter !== "all") {
      filtered = filtered.filter((item) => item.trend === trendFilter);
    }

    return filtered;
  }, [comparisonData, searchQuery, stateFilter, cityFilter, salesmanFilter, trendFilter]);

  // Apply sorting
  const sortedData = useMemo(() => {
    const sorted = [...filteredData];
    sorted.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return 0;
    });
    return sorted;
  }, [filteredData, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate stats
  const oneYearSchools = comparisonData.filter((s) => s.yearsActive === 1);
  const twoYearSchools = comparisonData.filter((s) => s.yearsActive === 2);
  const threeYearSchools = comparisonData.filter((s) => s.yearsActive === 3);

  const topPerformers = [...comparisonData]
    .sort((a, b) => b.sales3Year - a.sales3Year)
    .slice(0, 5);

  const avgGrowth = comparisonData.length > 0
    ? comparisonData.reduce((sum, s) => sum + s.overallGrowth, 0) / comparisonData.length
    : 0;

  // Get unique values for filters
  const states = Array.from(new Set(comparisonData.map((s) => s.state))).sort();
  const cities = Array.from(new Set(comparisonData.map((s) => s.city))).sort();
  const salesmen = Array.from(new Set(comparisonData.map((s) => s.assignedTo))).sort();

  const handleSort = (field: keyof YearComparisonData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const handleExport = () => {
    toast.success("Exporting year comparison data to Excel...");
  };

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (trend === "down") return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-blue-600" />;
  };

  const getTrendBadge = (trend: string) => {
    if (trend === "up") return <Badge className="bg-green-100 text-green-700 border-green-300">Growing</Badge>;
    if (trend === "down") return <Badge className="bg-red-100 text-red-700 border-red-300">Declining</Badge>;
    return <Badge className="bg-blue-100 text-blue-700 border-blue-300">Stable</Badge>;
  };

  const SortableHeader = ({ field, children }: { field: keyof YearComparisonData; children: React.ReactNode }) => (
    <TableHead
      className="cursor-pointer hover:bg-muted/50 select-none"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortField === field && (
          sortDirection === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
        )}
      </div>
    </TableHead>
  );

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title="Year-wise Business Comparison"
          description="Identify consistent performers and growth trends across years"
        />

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <p className="text-sm font-medium text-muted-foreground">1-Year Schools</p>
                </div>
                <p className="text-3xl font-bold text-blue-600">{oneYearSchools.length}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  ₹{oneYearSchools.reduce((sum, s) => sum + s.sales1Year, 0).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <p className="text-sm font-medium text-muted-foreground">2-Year Schools</p>
                </div>
                <p className="text-3xl font-bold text-green-600">{twoYearSchools.length}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  ₹{twoYearSchools.reduce((sum, s) => sum + s.sales2Year, 0).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Award className="h-4 w-4 text-purple-600" />
                  <p className="text-sm font-medium text-muted-foreground">3-Year Schools</p>
                </div>
                <p className="text-3xl font-bold text-purple-600">{threeYearSchools.length}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  ₹{threeYearSchools.reduce((sum, s) => sum + s.sales3Year, 0).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-orange-600" />
                  <p className="text-sm font-medium text-muted-foreground">Avg Growth</p>
                </div>
                <p className="text-3xl font-bold text-orange-600">
                  {avgGrowth > 0 ? "+" : ""}{avgGrowth.toFixed(1)}%
                </p>
                <p className="text-xs text-muted-foreground mt-1">Year-on-Year</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-pink-500">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Award className="h-4 w-4 text-pink-600" />
                  <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                </div>
                <p className="text-2xl font-bold text-pink-600">
                  ₹{(comparisonData.reduce((sum, s) => sum + s.sales3Year, 0) / 1000000).toFixed(1)}M
                </p>
                <p className="text-xs text-muted-foreground mt-1">3 Years Combined</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top 5 Best Performing Schools */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-600" />
              Top 5 Best Performing Schools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topPerformers.map((school, index) => (
                <div
                  key={school.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {index === 0 && "🥇"}
                      {index === 1 && "🥈"}
                      {index === 2 && "🥉"}
                      {index > 2 && `#${index + 1}`}
                    </span>
                    <div>
                      <p className="font-semibold">{school.name}</p>
                      <p className="text-xs text-muted-foreground">{school.city}, {school.state}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">₹{school.sales3Year.toLocaleString()}</p>
                    <div className="flex items-center gap-1 justify-end">
                      {getTrendIcon(school.trend)}
                      <span className={`text-xs font-medium ${
                        school.overallGrowth > 0 ? "text-green-600" :
                        school.overallGrowth < 0 ? "text-red-600" : "text-blue-600"
                      }`}>
                        {school.overallGrowth > 0 ? "+" : ""}{school.overallGrowth.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Filters and Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="relative lg:col-span-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search schools..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-9"
                />
              </div>

              <Select value={stateFilter} onValueChange={(val) => { setStateFilter(val); setCurrentPage(1); }}>
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

              <Select value={cityFilter} onValueChange={(val) => { setCityFilter(val); setCurrentPage(1); }}>
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

              <Select value={salesmanFilter} onValueChange={(val) => { setSalesmanFilter(val); setCurrentPage(1); }}>
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

              <Select value={trendFilter} onValueChange={(val) => { setTrendFilter(val); setCurrentPage(1); }}>
                <SelectTrigger>
                  <SelectValue placeholder="All Trends" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Trends</SelectItem>
                  <SelectItem value="up">Growing</SelectItem>
                  <SelectItem value="stable">Stable</SelectItem>
                  <SelectItem value="down">Declining</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Showing {paginatedData.length} of {sortedData.length} schools
              </p>
              <Button onClick={handleExport} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export to Excel
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Comparison Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[60px]">Rank</TableHead>
                    <SortableHeader field="name">
                      <span className="min-w-[200px]">School Name</span>
                    </SortableHeader>
                    <SortableHeader field="city">
                      <span className="min-w-[120px]">City / State</span>
                    </SortableHeader>
                    <SortableHeader field="sales1Year">
                      <span className="min-w-[130px]">Sales (1 Year)</span>
                    </SortableHeader>
                    <SortableHeader field="sales2Year">
                      <span className="min-w-[130px]">Sales (2 Years)</span>
                    </SortableHeader>
                    <SortableHeader field="sales3Year">
                      <span className="min-w-[130px]">Sales (3 Years)</span>
                    </SortableHeader>
                    <SortableHeader field="overallGrowth">
                      <span className="min-w-[100px]">Growth %</span>
                    </SortableHeader>
                    <TableHead className="min-w-[100px]">Trend</TableHead>
                    <TableHead className="min-w-[100px]">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                        No schools found matching your criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedData.map((school, index) => {
                      const globalRank = (currentPage - 1) * itemsPerPage + index + 1;
                      return (
                        <TableRow key={school.id}>
                          <TableCell className="font-semibold">
                            {globalRank <= 3 ? (
                              <span className="text-lg">
                                {globalRank === 1 && "🥇"}
                                {globalRank === 2 && "🥈"}
                                {globalRank === 3 && "🥉"}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">#{globalRank}</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <School className="h-4 w-4 text-primary shrink-0" />
                              <div>
                                <p className="font-medium">{school.name}</p>
                                <p className="text-xs text-muted-foreground">{school.board}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{school.city}</p>
                              <p className="text-xs text-muted-foreground">{school.state}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className={school.sales1Year > 0 ? "font-medium" : "text-muted-foreground"}>
                              {school.sales1Year > 0 ? `₹${school.sales1Year.toLocaleString()}` : "-"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className={school.sales2Year > 0 ? "font-medium" : "text-muted-foreground"}>
                              {school.sales2Year > 0 ? `₹${school.sales2Year.toLocaleString()}` : "-"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className={school.sales3Year > 0 ? "font-bold text-primary" : "text-muted-foreground"}>
                              {school.sales3Year > 0 ? `₹${school.sales3Year.toLocaleString()}` : "-"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {getTrendIcon(school.trend)}
                              <span className={`font-medium ${
                                school.overallGrowth > 0 ? "text-green-600" :
                                school.overallGrowth < 0 ? "text-red-600" : "text-blue-600"
                              }`}>
                                {school.overallGrowth > 0 ? "+" : ""}
                                {school.overallGrowth.toFixed(1)}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>{getTrendBadge(school.trend)}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </PageContainer>
  );
}

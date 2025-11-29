"use client";

import { useState, useEffect } from "react";
import { Search, School, MapPin, Users, BookOpen, TrendingUp } from "lucide-react";
import PageContainer from "@/components/layouts/PageContainer";
import PageHeader from "@/components/layouts/PageHeader";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { School as SchoolType } from "@/types";

// Import mock data
import schoolsData from "@/lib/mock-data/schools.json";

export default function SchoolListPage() {
  const [schools, setSchools] = useState<SchoolType[]>([]);
  const [filteredSchools, setFilteredSchools] = useState<SchoolType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("all");
  const [boardFilter, setBoardFilter] = useState("all");

  useEffect(() => {
    setSchools(schoolsData as SchoolType[]);
    setFilteredSchools(schoolsData as SchoolType[]);
  }, []);

  useEffect(() => {
    let filtered = schools;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (school) =>
          school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          school.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          school.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // City filter
    if (cityFilter !== "all") {
      filtered = filtered.filter((school) => school.city === cityFilter);
    }

    // Board filter
    if (boardFilter !== "all") {
      filtered = filtered.filter((school) => school.board === boardFilter);
    }

    setFilteredSchools(filtered);
  }, [searchQuery, cityFilter, boardFilter, schools]);

  // Get unique cities and boards for filters
  const cities = Array.from(new Set(schools.map((s) => s.city))).sort();
  const boards = Array.from(new Set(schools.map((s) => s.board))).sort();

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title="School List"
          description={`Complete list of ${schools.length} schools`}
        />

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search schools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              <Select value={cityFilter} onValueChange={setCityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Cities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={boardFilter} onValueChange={setBoardFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Boards" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Boards</SelectItem>
                  {boards.map((board) => (
                    <SelectItem key={board} value={board}>
                      {board}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center text-sm text-muted-foreground">
                {filteredSchools.length} schools found
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Schools Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[80px]">ID</TableHead>
                    <TableHead className="min-w-[200px]">School Name</TableHead>
                    <TableHead className="min-w-[150px]">City</TableHead>
                    <TableHead className="min-w-[80px]">Board</TableHead>
                    <TableHead className="min-w-[100px]">Strength</TableHead>
                    <TableHead className="min-w-[300px]">Address</TableHead>
                    <TableHead className="min-w-[100px]">Status</TableHead>
                    <TableHead className="min-w-[100px]">Visits</TableHead>
                    <TableHead className="min-w-[120px]">Last Visit</TableHead>
                    <TableHead className="min-w-[100px]">Revenue (2025)</TableHead>
                    <TableHead className="min-w-[150px]">Assigned To</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSchools.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={11} className="text-center py-8 text-muted-foreground">
                        No schools found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSchools.map((school) => (
                      <TableRow key={school.id}>
                        <TableCell className="font-medium">{school.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <School className="h-4 w-4 text-primary" />
                            <span className="font-medium">{school.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                            {school.city}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{school.board}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <Users className="h-3.5 w-3.5 text-muted-foreground" />
                            {school.strength.toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[300px]">
                          <p className="text-sm text-muted-foreground truncate">
                            {school.address}
                          </p>
                        </TableCell>
                        <TableCell>
                          {school.isPattakat ? (
                            <Badge variant="secondary">Pattakat</Badge>
                          ) : (
                            <Badge>Active</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                            {school.visitCount}
                          </span>
                        </TableCell>
                        <TableCell>
                          {school.lastVisitDate ? (
                            <span className="text-sm">
                              {new Date(school.lastVisitDate).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          ) : (
                            <span className="text-sm text-muted-foreground">Never</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <TrendingUp className="h-3.5 w-3.5 text-green-600" />
                            <span className="font-medium">
                              ₹{(school.businessHistory.find((h) => h.year === 2025)?.revenue || 0).toLocaleString()}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{school.assignedTo}</Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}

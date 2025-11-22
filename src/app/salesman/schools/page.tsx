"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Filter, Plus, MapPin, Calendar, Users, ChevronRight } from "lucide-react";
import PageContainer from "@/components/layouts/PageContainer";
import PageHeader from "@/components/layouts/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ListItemSkeleton } from "@/components/ui/skeleton-loaders";
import EmptyState from "@/components/ui/empty-state";
import { School } from "@/types";

// Import mock data
import schoolsData from "@/lib/mock-data/schools.json";

export default function SchoolListPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [schools, setSchools] = useState<School[]>([]);
  const [filteredSchools, setFilteredSchools] = useState<School[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [boardFilter, setBoardFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [visitFilter, setVisitFilter] = useState("all");

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      // Filter schools for current salesman (SM001)
      const assignedSchools = schoolsData.filter((s) => s.assignedTo === "SM001");
      setSchools(assignedSchools as School[]);
      setFilteredSchools(assignedSchools as School[]);
      setIsLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = schools;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (school) =>
          school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          school.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Board filter
    if (boardFilter !== "all") {
      filtered = filtered.filter((school) => school.board === boardFilter);
    }

    // City filter
    if (cityFilter !== "all") {
      filtered = filtered.filter((school) => school.city === cityFilter);
    }

    // Visit status filter
    if (visitFilter !== "all") {
      if (visitFilter === "0") {
        filtered = filtered.filter((school) => school.visitCount === 0);
      } else if (visitFilter === "1") {
        filtered = filtered.filter((school) => school.visitCount === 1);
      } else if (visitFilter === "2+") {
        filtered = filtered.filter((school) => school.visitCount >= 2);
      } else if (visitFilter === "pattakat") {
        filtered = filtered.filter((school) => school.isPattakat);
      }
    }

    setFilteredSchools(filtered);
  }, [searchQuery, boardFilter, cityFilter, visitFilter, schools]);

  // Get unique boards and cities
  const boards = ["all", ...Array.from(new Set(schools.map((s) => s.board)))];
  const cities = ["all", ...Array.from(new Set(schools.map((s) => s.city)))];

  if (isLoading) {
    return (
      <PageContainer>
        <PageHeader title="My Schools" description="Manage your assigned schools" />
        <div className="space-y-3">
          <ListItemSkeleton />
          <ListItemSkeleton />
          <ListItemSkeleton />
          <ListItemSkeleton />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="My Schools"
        description={`${schools.length} schools assigned`}
        action={
          <Link href="/salesman/schools/replacement">
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Request Replacement
            </Button>
          </Link>
        }
      />

      {/* Search and Filters */}
      <div className="space-y-3 mb-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search schools by name or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Select value={boardFilter} onValueChange={setBoardFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Board" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Boards</SelectItem>
              {boards.slice(1).map((board) => (
                <SelectItem key={board} value={board}>
                  {board}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={cityFilter} onValueChange={setCityFilter}>
            <SelectTrigger>
              <SelectValue placeholder="City" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              {cities.slice(1).map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={visitFilter} onValueChange={setVisitFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Visit Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="0">Not Visited</SelectItem>
              <SelectItem value="1">Visited Once</SelectItem>
              <SelectItem value="2+">Visited 2+ times</SelectItem>
              <SelectItem value="pattakat">Pattakat</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery("");
              setBoardFilter("all");
              setCityFilter("all");
              setVisitFilter("all");
            }}
          >
            <Filter className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          Showing {filteredSchools.length} of {schools.length} schools
        </p>
      </div>

      {/* School List */}
      {filteredSchools.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No schools found"
          description="Try adjusting your search or filter criteria"
          action={{
            label: "Reset Filters",
            onClick: () => {
              setSearchQuery("");
              setBoardFilter("all");
              setCityFilter("all");
              setVisitFilter("all");
            },
          }}
        />
      ) : (
        <div className="space-y-3">
          {filteredSchools.map((school) => (
            <Link key={school.id} href={`/salesman/schools/${school.id}`}>
              <Card className="hover:shadow-md transition-all cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-base mb-1 truncate">
                            {school.name}
                          </h3>
                          <div className="flex flex-wrap gap-2 mb-2">
                            <Badge variant="secondary" className="text-xs">
                              {school.board}
                            </Badge>
                            {school.isPattakat && (
                              <Badge variant="destructive" className="text-xs">
                                Pattakat
                              </Badge>
                            )}
                            <Badge
                              variant={school.visitCount >= 2 ? "default" : "outline"}
                              className="text-xs"
                            >
                              {school.visitCount} visits
                            </Badge>
                          </div>
                          <div className="flex flex-col gap-1.5 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                              <MapPin className="h-3.5 w-3.5" />
                              <span>{school.city}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Users className="h-3.5 w-3.5" />
                              <span>{school.strength} students</span>
                            </div>
                            {school.lastVisitDate && (
                              <div className="flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>
                                  Last visit:{" "}
                                  {new Date(school.lastVisitDate).toLocaleDateString()}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </PageContainer>
  );
}

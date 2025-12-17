"use client";

import { useState, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight, Clock, MapPin, User, Building2, Briefcase, Phone, Filter } from "lucide-react";
import PageContainer from "@/components/layouts/PageContainer";
import PageHeader from "@/components/layouts/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Schedule {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  type: string;
  schoolId: string;
  schoolName: string;
  city: string;
  address: string;
  salesmanId: string;
  salesmanName: string;
  activity: string;
  status: string;
}

interface ProductManager {
  id: string;
  name: string;
  email: string;
  contactNo: string;
  state: string;
  status: string;
  currentStatus: string;
  schedules: Schedule[];
}

export default function PMCalendarPage() {
  const [productManagers, setProductManagers] = useState<ProductManager[]>([]);
  const [filteredManagers, setFilteredManagers] = useState<ProductManager[]>([]);
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date());
  const [stateFilter, setStateFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const data = require("@/lib/mock-data/product-manager-schedules.json");
    setProductManagers(data);
    setFilteredManagers(data);

    // Set to start of current week (Monday)
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diff);
    setCurrentWeekStart(monday);
  }, []);

  useEffect(() => {
    let filtered = productManagers;

    if (stateFilter !== "all") {
      filtered = filtered.filter((pm) => pm.state === stateFilter);
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (pm) => pm.currentStatus.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    setFilteredManagers(filtered);
  }, [stateFilter, statusFilter, productManagers]);

  const getWeekDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart);
      date.setDate(currentWeekStart.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(currentWeekStart.getDate() + (direction === "next" ? 7 : -7));
    setCurrentWeekStart(newDate);
  };

  const goToToday = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diff);
    setCurrentWeekStart(monday);
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const getSchedulesForDateAndPM = (date: Date, pm: ProductManager) => {
    const dateStr = formatDate(date);
    return pm.schedules.filter((schedule) => schedule.date === dateStr);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return formatDate(date) === formatDate(today);
  };

  const weekDates = getWeekDates();
  const uniqueStates = Array.from(new Set(productManagers.map((pm) => pm.state))).sort();

  const totalSchedulesThisWeek = filteredManagers.reduce((acc, pm) => {
    return (
      acc +
      pm.schedules.filter((s) => {
        const scheduleDate = new Date(s.date);
        const weekEnd = new Date(currentWeekStart);
        weekEnd.setDate(currentWeekStart.getDate() + 6);
        return scheduleDate >= currentWeekStart && scheduleDate <= weekEnd;
      }).length
    );
  }, 0);

  const busyManagersToday = filteredManagers.filter((pm) =>
    pm.schedules.some((s) => s.date === formatDate(new Date()))
  ).length;

  return (
    <PageContainer>
      <div className="flex items-center justify-between mb-6">
        <PageHeader
          title="Centralized PM Calendar"
          description="View all product manager schedules across the week"
        />

        <div className="flex items-center gap-3">
          <Select value={stateFilter} onValueChange={setStateFilter}>
            <SelectTrigger className="w-[180px]">
              <MapPin className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by State" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All States</SelectItem>
              {uniqueStates.map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="busy">Busy</SelectItem>
              <SelectItem value="free">Free</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Managers Shown</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredManagers.length}</div>
            <p className="text-xs text-muted-foreground">
              of {productManagers.length} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {totalSchedulesThisWeek}
            </div>
            <p className="text-xs text-muted-foreground">Total activities</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Busy Today</CardTitle>
            <Briefcase className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {busyManagersToday}
            </div>
            <p className="text-xs text-muted-foreground">
              {filteredManagers.length - busyManagersToday} available
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Week Range</CardTitle>
            <Clock className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold">
              {currentWeekStart.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}{" "}
              -{" "}
              {new Date(
                currentWeekStart.getTime() + 6 * 24 * 60 * 60 * 1000
              ).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </div>
            <p className="text-xs text-muted-foreground">
              {currentWeekStart.toLocaleDateString("en-US", { year: "numeric" })}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={() => navigateWeek("prev")}>
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button variant="outline" size="sm" onClick={goToToday}>
                Today
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigateWeek("next")}>
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-lg font-semibold">
              {currentWeekStart.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar Header */}
      <div className="grid grid-cols-8 gap-2 mb-4">
        <div className="bg-muted/50 rounded-lg p-3 font-semibold text-sm border">
          Manager
        </div>
        {weekDates.map((date, index) => (
          <div
            key={index}
            className={`rounded-lg p-3 text-center font-semibold border ${
              isToday(date)
                ? "bg-blue-500 text-white"
                : "bg-muted/30"
            }`}
          >
            <div className="text-xs uppercase">
              {date.toLocaleDateString("en-US", { weekday: "short" })}
            </div>
            <div className="text-2xl font-bold mt-1">{date.getDate()}</div>
            <div className="text-xs opacity-80">
              {date.toLocaleDateString("en-US", { month: "short" })}
            </div>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="space-y-2">
        {filteredManagers.map((pm) => (
          <Card key={pm.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="grid grid-cols-8 gap-2 p-2">
              {/* Manager Info Column */}
              <div className="bg-muted/30 rounded-lg p-4 border">
                <div className="space-y-2">
                  <div>
                    <h3 className="font-semibold text-sm">{pm.name}</h3>
                    <p className="text-xs text-muted-foreground">{pm.id}</p>
                  </div>

                  <div className="flex flex-col gap-1 text-xs">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span className="truncate">{pm.state}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Phone className="h-3 w-3 shrink-0" />
                      <span className="truncate text-[10px]">{pm.contactNo}</span>
                    </div>
                  </div>

                  <Badge
                    variant={pm.currentStatus === "Busy" ? "default" : "secondary"}
                    className={`w-full justify-center text-xs ${
                      pm.currentStatus === "Busy"
                        ? "bg-orange-500 hover:bg-orange-600"
                        : "bg-green-500 hover:bg-green-600 text-white"
                    }`}
                  >
                    {pm.currentStatus}
                  </Badge>
                </div>
              </div>

              {/* Day Columns */}
              {weekDates.map((date, dateIndex) => {
                const schedules = getSchedulesForDateAndPM(date, pm);
                const isCurrentDay = isToday(date);

                return (
                  <div
                    key={dateIndex}
                    className={`rounded-lg min-h-[140px] p-2 border ${
                      isCurrentDay
                        ? "bg-blue-50/50 dark:bg-blue-950/20 border-blue-200"
                        : "bg-card"
                    }`}
                  >
                    {schedules.length === 0 ? (
                      <div className="flex items-center justify-center h-full">
                        <span className="text-xs text-muted-foreground">—</span>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        {schedules.map((schedule) => (
                          <Popover key={schedule.id}>
                            <PopoverTrigger asChild>
                              <div className="bg-white dark:bg-gray-900 border-l-4 border-blue-500 rounded p-2 cursor-pointer hover:shadow-md transition-all">
                                <div className="flex items-center justify-between gap-1 mb-1">
                                  <Badge
                                    variant="outline"
                                    className="text-[9px] px-1 py-0 h-4"
                                  >
                                    {schedule.type === "workshop" ? (
                                      <Briefcase className="h-2 w-2" />
                                    ) : (
                                      <User className="h-2 w-2" />
                                    )}
                                  </Badge>
                                  <Badge
                                    className={`text-[9px] px-1 py-0 h-4 ${
                                      schedule.status === "confirmed"
                                        ? "bg-green-500"
                                        : "bg-gray-400"
                                    }`}
                                  >
                                    {schedule.status}
                                  </Badge>
                                </div>

                                <div className="text-[10px] font-medium text-muted-foreground mb-1 flex items-center gap-1">
                                  <Clock className="h-2.5 w-2.5" />
                                  {schedule.startTime}
                                </div>

                                <div className="text-[11px] font-semibold line-clamp-2 leading-tight mb-1">
                                  {schedule.schoolName}
                                </div>

                                <div className="text-[10px] text-muted-foreground line-clamp-1">
                                  {schedule.city}
                                </div>
                              </div>
                            </PopoverTrigger>
                            <PopoverContent className="w-80" align="start">
                              <div className="space-y-3">
                                <div>
                                  <h4 className="font-semibold mb-1">Schedule Details</h4>
                                  <div className="flex gap-2">
                                    <Badge
                                      variant="outline"
                                      className="capitalize"
                                    >
                                      {schedule.type}
                                    </Badge>
                                    <Badge
                                      className={
                                        schedule.status === "confirmed"
                                          ? "bg-green-500"
                                          : "bg-gray-400"
                                      }
                                    >
                                      {schedule.status}
                                    </Badge>
                                  </div>
                                </div>

                                <div className="space-y-2 text-sm">
                                  <div className="flex items-start gap-2">
                                    <Clock className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                                    <div>
                                      <div className="font-medium">Time</div>
                                      <div className="text-muted-foreground">
                                        {schedule.startTime} - {schedule.endTime}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-start gap-2">
                                    <Building2 className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                                    <div>
                                      <div className="font-medium">School</div>
                                      <div className="text-muted-foreground">
                                        {schedule.schoolName}
                                      </div>
                                      <div className="text-xs text-muted-foreground">
                                        {schedule.schoolId}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-start gap-2">
                                    <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                                    <div>
                                      <div className="font-medium">Location</div>
                                      <div className="text-muted-foreground">
                                        {schedule.city}
                                      </div>
                                      <div className="text-xs text-muted-foreground">
                                        {schedule.address}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-start gap-2">
                                    <User className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                                    <div>
                                      <div className="font-medium">Salesman</div>
                                      <div className="text-muted-foreground">
                                        {schedule.salesmanName}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-start gap-2">
                                    <Briefcase className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                                    <div>
                                      <div className="font-medium">Activity</div>
                                      <div className="text-muted-foreground">
                                        {schedule.activity}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        ))}
      </div>

      {filteredManagers.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No Managers Found</h3>
            <p className="text-muted-foreground">
              Adjust your filters to see product managers
            </p>
          </CardContent>
        </Card>
      )}
    </PageContainer>
  );
}

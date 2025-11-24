"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, MapPin, School, ChevronRight } from "lucide-react";
import PageContainer from "@/components/layouts/PageContainer";
import PageHeader from "@/components/layouts/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageSkeleton } from "@/components/ui/skeleton-loaders";
import EmptyState from "@/components/ui/empty-state";

import visitsData from "@/lib/mock-data/visits.json";
import schoolsData from "@/lib/mock-data/schools.json";

export default function NextVisitsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [scheduledVisits, setScheduledVisits] = useState<any[]>([]);

  useEffect(() => {
    setTimeout(() => {
      // Get scheduled visits for current salesman
      const scheduled = visitsData.filter(
        (v) => v.status === "Scheduled" && v.salesmanId === "SM001"
      );

      // Get visits with nextVisit scheduled
      const nextVisits = visitsData
        .filter((v) => v.nextVisit && v.salesmanId === "SM001" && v.status === "Completed")
        .map((v) => ({
          id: `NEXT-${v.id}`,
          schoolId: v.schoolId,
          schoolName: v.schoolName,
          date: v.nextVisit!.date,
          purpose: v.nextVisit!.purpose,
          status: "Scheduled",
          type: "school",
        }));

      const allScheduled = [...scheduled, ...nextVisits];
      setScheduledVisits(allScheduled);
      setIsLoading(false);
    }, 800);
  }, []);

  if (isLoading) {
    return (
      <PageContainer>
        <PageSkeleton />
      </PageContainer>
    );
  }

  // Separate into upcoming and overdue
  const today = new Date();
  const upcoming = scheduledVisits.filter((v) => new Date(v.date) >= today);
  const overdue = scheduledVisits.filter((v) => new Date(v.date) < today);

  const renderVisitCard = (visit: any) => {
    const school = schoolsData.find((s) => s.id === visit.schoolId);
    const visitDate = new Date(visit.date);
    const isOverdue = visitDate < today;

    return (
      <Link key={visit.id} href={school ? `/salesman/schools/${school.id}` : "#"}>
        <Card className="hover:shadow-md transition-all cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">
                    {visitDate.toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  {isOverdue && <Badge variant="destructive">Overdue</Badge>}
                </div>

                <h3 className="font-semibold text-base mb-1">{visit.schoolName}</h3>

                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    {visit.purpose || visit.purposes?.[0] || "Follow-up"}
                  </Badge>
                </div>

                {school && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{school.city}</span>
                  </div>
                )}
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  };

  return (
    <PageContainer>
      <PageHeader
        title="Next Visits"
        description="Your scheduled upcoming visits"
      />

      <Tabs defaultValue="upcoming" className="mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">
            Upcoming ({upcoming.length})
          </TabsTrigger>
          <TabsTrigger value="overdue">
            Overdue ({overdue.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6">
          {upcoming.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="No upcoming visits"
              description="You don't have any visits scheduled for the future"
              action={{
                label: "Add School Visit",
                onClick: () => (window.location.href = "/salesman/schools/add-visit"),
              }}
            />
          ) : (
            <div className="space-y-3">
              {upcoming
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map(renderVisitCard)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="overdue" className="mt-6">
          {overdue.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Great! No overdue visits
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {overdue
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map(renderVisitCard)}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Total Scheduled</p>
              <School className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold">{scheduledVisits.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">This Week</p>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold">
              {
                upcoming.filter((v) => {
                  const visitDate = new Date(v.date);
                  const weekFromNow = new Date();
                  weekFromNow.setDate(weekFromNow.getDate() + 7);
                  return visitDate <= weekFromNow;
                }).length
              }
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Needs Attention</p>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold text-destructive">{overdue.length}</p>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}

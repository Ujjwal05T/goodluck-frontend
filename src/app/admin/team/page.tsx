"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Plus, MapPin, Target, TrendingUp } from "lucide-react";
import PageContainer from "@/components/layouts/PageContainer";
import PageHeader from "@/components/layouts/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PageSkeleton } from "@/components/ui/skeleton-loaders";

import salesmenData from "@/lib/mock-data/salesmen.json";

export default function TeamManagementPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [salesmen, setSalesmen] = useState<any[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setSalesmen(salesmenData);
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

  return (
    <PageContainer>
      <PageHeader
        title="Sales Team Management"
        description="Manage your sales team and assignments"
        action={
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Salesman
          </Button>
        }
      />

      {/* Team Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Total Team</p>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold">{salesmen.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Total Schools</p>
              <Target className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold">
              {salesmen.reduce((sum, s) => sum + s.assignedSchools, 0)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Avg Achievement</p>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold">
              {Math.round(
                salesmen.reduce(
                  (sum, s) => sum + (s.salesAchieved / s.salesTarget) * 100,
                  0
                ) / salesmen.length
              )}
              %
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Specimen Budget</p>
              <Target className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold">
              ₹{(salesmen.reduce((sum, s) => sum + s.specimenBudget, 0) / 100000).toFixed(1)}L
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Salesmen List */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {salesmen.map((salesman) => {
              const achievement = Math.round(
                (salesman.salesAchieved / salesman.salesTarget) * 100
              );
              const specimenUsage = Math.round(
                (salesman.specimenUsed / salesman.specimenBudget) * 100
              );

              return (
                <Card key={salesman.id} className="hover:shadow-md transition-all">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Salesman Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="font-semibold text-sm">
                              {salesman.name
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold">{salesman.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {salesman.id} • {salesman.email}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                          <div>
                            <p className="text-xs text-muted-foreground">Region</p>
                            <p className="text-sm font-medium">
                              {salesman.region} - {salesman.state}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Manager</p>
                            <p className="text-sm font-medium">{salesman.managerName}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Schools</p>
                            <p className="text-sm font-medium">{salesman.assignedSchools}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Joined</p>
                            <p className="text-sm font-medium">
                              {new Date(salesman.joinedDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Performance */}
                      <div className="w-full md:w-72 space-y-3">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-xs text-muted-foreground">Sales Achievement</p>
                            <Badge
                              variant={
                                achievement >= 75
                                  ? "default"
                                  : achievement >= 50
                                  ? "secondary"
                                  : "destructive"
                              }
                            >
                              {achievement}%
                            </Badge>
                          </div>
                          <Progress value={achievement} className="h-2" />
                          <p className="text-xs text-muted-foreground mt-1">
                            ₹{(salesman.salesAchieved / 100000).toFixed(1)}L / ₹
                            {(salesman.salesTarget / 100000).toFixed(1)}L
                          </p>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-xs text-muted-foreground">Specimen Usage</p>
                            <span className="text-xs">{specimenUsage}%</span>
                          </div>
                          <Progress value={specimenUsage} className="h-2" />
                          <p className="text-xs text-muted-foreground mt-1">
                            ₹{(salesman.specimenUsed / 100000).toFixed(1)}L / ₹
                            {(salesman.specimenBudget / 100000).toFixed(1)}L
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-4 pt-4 border-t">
                      <Button variant="outline" size="sm">
                        View Dashboard
                      </Button>
                      <Button variant="outline" size="sm">
                        Reassign Schools
                      </Button>
                      <Button variant="outline" size="sm">
                        Edit Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}

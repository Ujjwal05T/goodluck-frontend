"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  MapPin,
  Target,
  TrendingUp,
  Phone,
  Mail,
  Calendar,
  Users,
  School,
  BookOpen,
  IndianRupee,
  BarChart3,
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  Activity,
  Package,
  Building,
  FileText,
  MessageSquare,
} from "lucide-react";
import PageContainer from "@/components/layouts/PageContainer";
import PageHeader from "@/components/layouts/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { DashboardSkeleton } from "@/components/ui/skeleton-loaders";

import salesmenData from "@/lib/mock-data/salesmen.json";
import visitsData from "@/lib/mock-data/visits.json";
import schoolsData from "@/lib/mock-data/schools.json";

export default function SalesmanDashboardPage() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [salesman, setSalesman] = useState<any>(null);
  const [salesmanVisits, setSalesmanVisits] = useState<any[]>([]);
  const [assignedSchools, setAssignedSchools] = useState<any[]>([]);

  useEffect(() => {
    setTimeout(() => {
      const foundSalesman = salesmenData.find((s) => s.id === params.id);
      if (foundSalesman) {
        setSalesman(foundSalesman);

        // Get visits for this salesman
        const visits = visitsData.filter((v) => v.salesmanId === params.id);
        setSalesmanVisits(visits);

        // Get assigned schools for this salesman
        const schools = schoolsData.filter((s) => s.assignedTo === params.id);
        setAssignedSchools(schools);
      }
      setIsLoading(false);
    }, 500);
  }, [params.id]);

  if (isLoading) {
    return (
      <PageContainer>
        <DashboardSkeleton />
      </PageContainer>
    );
  }

  if (!salesman) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Salesman Not Found</h2>
          <p className="text-muted-foreground mb-6">The requested salesman does not exist.</p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </PageContainer>
    );
  }

  const achievement = Math.round(((salesman.salesAchieved || salesman.salesAchieved || 0) / salesman.salesTarget) * 100);
  const specimenUsage = Math.round((salesman.specimenUsed / salesman.specimenBudget) * 100);

  // Calculate recent performance metrics
  const recentVisits = (salesmanVisits || []).slice(-10);
  const totalSpecimenCost = (salesmanVisits || []).reduce((sum, visit) => sum + (visit.totalSpecimenCost || 0), 0);
  const uniqueSchoolsVisited = new Set((salesmanVisits || []).map(v => v.schoolId).filter(Boolean)).size;

  return (
    <PageContainer>
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Team
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="font-semibold text-lg">
                {salesman.name ? salesman.name.split(" ").map((n: string) => n[0]).join("") : "NA"}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">{salesman.name}</h1>
              <p className="text-muted-foreground">
                {salesman.id} • {salesman.status}
              </p>
            </div>
            <Badge variant={salesman.status === "Active" ? "default" : "secondary"}>
              {salesman.status}
            </Badge>
          </div>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid gap-4 md:grid-cols-5 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Sales Target</p>
              <Target className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold">₹{(salesman.salesTarget / 100000).toFixed(1)}L</p>
            <p className="text-xs text-muted-foreground">Annual target</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Sales Achieved</p>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold">₹{((salesman.salesAchieved || salesman.salesAchieved || 0) / 100000).toFixed(1)}L</p>
            <Badge variant={achievement >= 75 ? "default" : achievement >= 50 ? "secondary" : "destructive"}>
              {achievement}%
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Specimen Budget</p>
              <Package className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold">₹{(salesman.specimenBudget / 100000).toFixed(1)}L</p>
            <p className="text-xs text-muted-foreground">{specimenUsage}% used</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Assigned Schools</p>
              <School className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold">{salesman.assignedSchools}</p>
            <p className="text-xs text-muted-foreground">{uniqueSchoolsVisited} visited</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Total Visits</p>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold">{salesmanVisits.length}</p>
            <p className="text-xs text-muted-foreground">This period</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="visits">Visits</TabsTrigger>
          <TabsTrigger value="schools">Schools</TabsTrigger>
          <TabsTrigger value="specimens">Specimens</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-medium">{salesman.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Employee ID</p>
                    <p className="font-medium">{salesman.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{salesman.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{salesman.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Join Date</p>
                    <p className="font-medium">
                      {new Date(salesman.joinedDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge variant={salesman.status === "Active" ? "default" : "secondary"}>
                      {salesman.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Territory Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Region</p>
                    <p className="font-medium">{salesman.region}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">State</p>
                    <p className="font-medium">{salesman.state}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Cities Covered</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {salesman.cities && salesman.cities.length > 0 ? (
                        salesman.cities.map((city: string, index: number) => (
                          <Badge key={index} variant="outline">{city}</Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">No cities assigned</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Manager</p>
                    <p className="font-medium">{salesman.managerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Manager ID</p>
                    <p className="font-medium">{salesman.managerId}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sales Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Sales Performance Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">Sales Achievement</p>
                    <Badge variant={achievement >= 75 ? "default" : achievement >= 50 ? "secondary" : "destructive"}>
                      {achievement}%
                    </Badge>
                  </div>
                  <Progress value={achievement} className="h-3" />
                  <p className="text-sm text-muted-foreground mt-1">
                    ₹{((salesman.salesAchieved || salesman.salesAchieved || 0) / 100000).toFixed(1)}L achieved out of ₹{(salesman.salesTarget / 100000).toFixed(1)}L target
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">Specimen Usage</p>
                    <Badge variant={specimenUsage <= 80 ? "default" : "destructive"}>
                      {specimenUsage}%
                    </Badge>
                  </div>
                  <Progress value={specimenUsage} className="h-3" />
                  <p className="text-sm text-muted-foreground mt-1">
                    ₹{(salesman.specimenUsed / 100000).toFixed(1)}L used out of ₹{(salesman.specimenBudget / 100000).toFixed(1)}L budget
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Achievement Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Sales Achievement</span>
                  <span className="font-bold">{achievement}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Target Revenue</span>
                  <span className="font-bold">₹{(salesman.salesTarget / 100000).toFixed(1)}L</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Achieved Revenue</span>
                  <span className="font-bold">₹{((salesman.salesAchieved || salesman.salesAchieved || 0) / 100000).toFixed(1)}L</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Conversion Rate</span>
                  <span className="font-bold">
                    {Math.round(((salesman.salesAchieved || salesman.salesAchieved || 0) / salesman.salesTarget) * 100)}%
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  School Coverage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Assigned</span>
                  <span className="font-bold">{salesman.assignedSchools}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Visited This Month</span>
                  <span className="font-bold">{uniqueSchoolsVisited}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Coverage Rate</span>
                  <span className="font-bold">
                    {Math.round((uniqueSchoolsVisited / salesman.assignedSchools) * 100)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Avg School Value</span>
                  <span className="font-bold">
                    ₹{Math.round(salesman.salesTarget / salesman.assignedSchools / 1000)}K
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Specimen Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Budget</span>
                  <span className="font-bold">₹{(salesman.specimenBudget / 100000).toFixed(1)}L</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Used</span>
                  <span className="font-bold">₹{(salesman.specimenUsed / 100000).toFixed(1)}L</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Remaining</span>
                  <span className="font-bold">
                    ₹{((salesman.specimenBudget - salesman.specimenUsed) / 100000).toFixed(1)}L
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Cost per Visit</span>
                  <span className="font-bold">
                    ₹{salesmanVisits.length > 0 ? Math.round(salesman.specimenUsed / salesmanVisits.length) : 0}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Visits Tab */}
        <TabsContent value="visits" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recent Visit History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentVisits.length > 0 ? (
                <div className="space-y-4">
                  {recentVisits.map((visit, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <School className="h-4 w-4" />
                          <span className="font-medium">{visit.schoolName}</span>
                          <Badge variant="outline">{visit.type}</Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(visit.date).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Purpose</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {visit.purposes && visit.purposes.length > 0 ? (
                              visit.purposes.map((purpose: string, pIndex: number) => (
                                <Badge key={pIndex} variant="secondary" className="text-xs">
                                  {purpose}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-xs text-muted-foreground">No purposes specified</span>
                            )}
                          </div>
                        </div>

                        <div>
                          <p className="text-muted-foreground">Contacts Met</p>
                          <p className="text-xs">
                            {visit.contacts && visit.contacts.length > 0
                              ? visit.contacts.map((c: any) => c.name).join(", ")
                              : "No contacts recorded"
                            }
                          </p>
                        </div>

                        <div>
                          <p className="text-muted-foreground">Specimen Cost</p>
                          <p className="font-medium">₹{visit.totalSpecimenCost || 0}</p>
                        </div>
                      </div>

                      {visit.feedback && (
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-sm text-muted-foreground">Feedback</p>
                          <p className="text-sm mt-1">{visit.feedback.comment}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No visits recorded</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Schools Tab */}
        <TabsContent value="schools" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <School className="h-5 w-5" />
                Assigned Schools ({assignedSchools.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {assignedSchools.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {assignedSchools.map((school, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{school.name}</h3>
                        <Badge variant={school.isPattakat ? "default" : "secondary"}>
                          {school.isPattakat ? "Pattakat" : "Regular"}
                        </Badge>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3" />
                          <span>{school.address}</span>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="text-muted-foreground">Board: {school.board}</span>
                          <span className="text-muted-foreground">Strength: {school.strength}</span>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="text-muted-foreground">Visits: {school.visitCount}</span>
                          <span className="text-muted-foreground">
                            Last: {school.lastVisitDate ? new Date(school.lastVisitDate).toLocaleDateString() : "Never"}
                          </span>
                        </div>

                        {school.businessHistory && school.businessHistory.length > 0 && (
                          <div className="pt-2 border-t">
                            <p className="text-muted-foreground mb-1">Business History</p>
                            <div className="flex gap-4 text-xs">
                              {school.businessHistory.map((history: any, hIndex: number) => (
                                <span key={hIndex}>
                                  {history.year}: ₹{(history.revenue / 1000).toFixed(0)}K
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <School className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No schools assigned</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Specimens Tab */}
        <TabsContent value="specimens" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Specimen Distribution History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {salesmanVisits.length > 0 ? (
                <div className="space-y-4">
                  {salesmanVisits.map((visit, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <School className="h-4 w-4" />
                          <span className="font-medium">{visit.schoolName}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(visit.date).toLocaleDateString()}
                        </span>
                      </div>

                      {visit.specimensGiven && visit.specimensGiven.length > 0 ? (
                        <div className="grid gap-2 text-sm">
                          {visit.specimensGiven.map((specimen: any, sIndex: number) => (
                            <div key={sIndex} className="flex items-center justify-between p-2 bg-muted rounded">
                              <div>
                                <span className="font-medium">{specimen.subject} - Class {specimen.class}</span>
                                <p className="text-xs text-muted-foreground">{specimen.book}</p>
                              </div>
                              <div className="text-right">
                                <span className="font-medium">{specimen.quantity} copies</span>
                                <p className="text-xs">₹{specimen.cost}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No specimens distributed</p>
                      )}
                    </div>
                  ))}

                  <Separator />

                  <div className="flex justify-between items-center pt-4">
                    <span className="font-medium">Total Specimen Cost:</span>
                    <span className="text-lg font-bold">₹{totalSpecimenCost}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No specimen distribution records</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Tab */}
        <TabsContent value="contact" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{salesman.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{salesman.phone}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Reporting Manager</p>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-medium">
                        {salesman.managerName ? salesman.managerName.split(" ").map((n: string) => n[0]).join("") : "NA"}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{salesman.managerName}</p>
                      <p className="text-xs text-muted-foreground">{salesman.managerId}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Department Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Department</p>
                  <p className="font-medium">Sales</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Role</p>
                  <p className="font-medium">Sales Representative</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Territory</p>
                  <p className="font-medium">{salesman.region} - {salesman.state}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Cities Covered</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {salesman.cities.map((city: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {city}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}
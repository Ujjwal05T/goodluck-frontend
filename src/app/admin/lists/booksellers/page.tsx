"use client";

import { useState, useEffect } from "react";
import { Search, Store, User, Phone, Mail, MapPin, CreditCard, TrendingUp, Calendar } from "lucide-react";
import PageContainer from "@/components/layouts/PageContainer";
import PageHeader from "@/components/layouts/PageHeader";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BookSeller } from "@/types";

// Import mock data
import bookSellersData from "@/lib/mock-data/book-sellers.json";

export default function BooksellerListPage() {
  const [booksellers, setBooksellers] = useState<BookSeller[]>([]);
  const [filteredBooksellers, setFilteredBooksellers] = useState<BookSeller[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("all");

  useEffect(() => {
    setBooksellers(bookSellersData as BookSeller[]);
    setFilteredBooksellers(bookSellersData as BookSeller[]);
  }, []);

  useEffect(() => {
    let filtered = booksellers;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (seller) =>
          seller.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          seller.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          seller.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          seller.phone.includes(searchQuery) ||
          seller.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // City filter
    if (cityFilter !== "all") {
      filtered = filtered.filter((seller) => seller.city === cityFilter);
    }

    setFilteredBooksellers(filtered);
  }, [searchQuery, cityFilter, booksellers]);

  // Get unique cities for filter
  const cities = Array.from(new Set(booksellers.map((b) => b.city))).sort();

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title="Bookseller List"
          description={`Complete list of ${booksellers.length} booksellers`}
        />

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search booksellers..."
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

              <div className="flex items-center text-sm text-muted-foreground">
                {filteredBooksellers.length} booksellers found
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Total Outstanding</p>
                <p className="text-2xl font-bold text-orange-600">
                  ₹{booksellers.reduce((sum, b) => sum + b.currentOutstanding, 0).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Total Credit Limit</p>
                <p className="text-2xl font-bold text-green-600">
                  ₹{booksellers.reduce((sum, b) => sum + b.creditLimit, 0).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Total Revenue (2025)</p>
                <p className="text-2xl font-bold text-primary">
                  ₹{booksellers.reduce((sum, b) => sum + (b.businessHistory.find((h) => h.year === 2025)?.revenue || 0), 0).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Booksellers Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[80px]">ID</TableHead>
                    <TableHead className="min-w-[200px]">Shop Name</TableHead>
                    <TableHead className="min-w-[150px]">Owner Name</TableHead>
                    <TableHead className="min-w-[120px]">City</TableHead>
                    <TableHead className="min-w-[300px]">Address</TableHead>
                    <TableHead className="min-w-[140px]">Phone</TableHead>
                    <TableHead className="min-w-[200px]">Email</TableHead>
                    <TableHead className="min-w-[150px]">GST Number</TableHead>
                    <TableHead className="min-w-[130px]">Outstanding</TableHead>
                    <TableHead className="min-w-[130px]">Credit Limit</TableHead>
                    <TableHead className="min-w-[120px]">Last Visit</TableHead>
                    <TableHead className="min-w-[140px]">Revenue (2025)</TableHead>
                    <TableHead className="min-w-[120px]">Assigned To</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBooksellers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={13} className="text-center py-8 text-muted-foreground">
                        No booksellers found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredBooksellers.map((seller) => {
                      const outstandingPercentage = (seller.currentOutstanding / seller.creditLimit) * 100;

                      return (
                        <TableRow key={seller.id}>
                          <TableCell className="font-medium">{seller.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Store className="h-4 w-4 text-primary" />
                              <span className="font-medium">{seller.shopName}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5">
                              <User className="h-3.5 w-3.5 text-muted-foreground" />
                              {seller.ownerName}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5">
                              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                              {seller.city}
                            </div>
                          </TableCell>
                          <TableCell className="max-w-[300px]">
                            <p className="text-sm text-muted-foreground truncate">
                              {seller.address}
                            </p>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5">
                              <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                              <span className="text-sm">{seller.phone}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5">
                              <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                              <span className="text-sm">{seller.email}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5">
                              <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
                              <span className="text-xs font-mono">{seller.gstNumber}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium text-orange-600">
                                ₹{seller.currentOutstanding.toLocaleString()}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {outstandingPercentage.toFixed(0)}% used
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="font-medium text-green-600">
                              ₹{seller.creditLimit.toLocaleString()}
                            </p>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                              <span className="text-sm">
                                {new Date(seller.lastVisitDate).toLocaleDateString("en-IN", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5">
                              <TrendingUp className="h-3.5 w-3.5 text-green-600" />
                              <span className="font-medium">
                                ₹{(seller.businessHistory.find((h) => h.year === 2025)?.revenue || 0).toLocaleString()}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{seller.assignedTo}</Badge>
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
      </div>
    </PageContainer>
  );
}

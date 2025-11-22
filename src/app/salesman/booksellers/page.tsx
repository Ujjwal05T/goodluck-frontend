"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, MapPin, DollarSign, Calendar, ChevronRight } from "lucide-react";
import PageContainer from "@/components/layouts/PageContainer";
import PageHeader from "@/components/layouts/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ListItemSkeleton } from "@/components/ui/skeleton-loaders";
import EmptyState from "@/components/ui/empty-state";
import { BookSeller } from "@/types";

// Import mock data
import bookSellersData from "@/lib/mock-data/book-sellers.json";

export default function BookSellerListPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [bookSellers, setBookSellers] = useState<BookSeller[]>([]);
  const [filteredSellers, setFilteredSellers] = useState<BookSeller[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      // Filter booksellers for current salesman (SM001)
      const assigned = bookSellersData.filter((b) => b.assignedTo === "SM001");
      setBookSellers(assigned as BookSeller[]);
      setFilteredSellers(assigned as BookSeller[]);
      setIsLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    // Apply search filter
    if (searchQuery) {
      const filtered = bookSellers.filter(
        (seller) =>
          seller.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          seller.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          seller.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSellers(filtered);
    } else {
      setFilteredSellers(bookSellers);
    }
  }, [searchQuery, bookSellers]);

  if (isLoading) {
    return (
      <PageContainer>
        <PageHeader title="Book Sellers" description="Manage your book seller relationships" />
        <div className="space-y-3">
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
        title="Book Sellers"
        description={`${bookSellers.length} book sellers assigned`}
        action={
          <Link href="/salesman/booksellers/add">
            <Button size="sm">
              Add New Seller
            </Button>
          </Link>
        }
      />

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by shop name, owner, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          Showing {filteredSellers.length} of {bookSellers.length} book sellers
        </p>
      </div>

      {/* Book Seller List */}
      {filteredSellers.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No book sellers found"
          description="Try adjusting your search criteria"
          action={{
            label: "Clear Search",
            onClick: () => setSearchQuery(""),
          }}
        />
      ) : (
        <div className="space-y-3">
          {filteredSellers.map((seller) => (
            <Link key={seller.id} href={`/salesman/booksellers/${seller.id}`}>
              <Card className="hover:shadow-md transition-all cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-base mb-1 truncate">
                            {seller.shopName}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            Owner: {seller.ownerName}
                          </p>

                          <div className="flex flex-col gap-1.5 text-xs text-muted-foreground mb-3">
                            <div className="flex items-center gap-1.5">
                              <MapPin className="h-3.5 w-3.5" />
                              <span>{seller.city}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5" />
                              <span>
                                Last visit:{" "}
                                {new Date(seller.lastVisitDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <Badge
                              variant={
                                seller.currentOutstanding > seller.creditLimit * 0.8
                                  ? "destructive"
                                  : seller.currentOutstanding > seller.creditLimit * 0.5
                                  ? "secondary"
                                  : "outline"
                              }
                            >
                              <DollarSign className="h-3 w-3 mr-1" />
                              Outstanding: ₹{(seller.currentOutstanding / 1000).toFixed(0)}K
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              Credit: ₹{(seller.creditLimit / 100000).toFixed(1)}L
                            </Badge>
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

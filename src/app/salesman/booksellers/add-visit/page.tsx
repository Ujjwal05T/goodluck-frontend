"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import PageContainer from "@/components/layouts/PageContainer";
import PageHeader from "@/components/layouts/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

import bookSellersData from "@/lib/mock-data/book-sellers.json";
import dropdownOptions from "@/lib/mock-data/dropdown-options.json";

export default function AddBookSellerVisitPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    bookSellerId: "",
    purposes: [] as string[],
    paymentCollected: 0,
    paymentDeadlines: [] as { amount: number; dueDate: string; percentage: number }[],
    notes: "",
  });

  const [newDeadline, setNewDeadline] = useState({
    amount: 0,
    dueDate: "",
    percentage: 0,
  });

  useEffect(() => {
    const sellerId = searchParams.get("sellerId");
    if (sellerId) {
      setFormData((prev) => ({ ...prev, bookSellerId: sellerId }));
    }
  }, [searchParams]);

  const handlePurposeToggle = (purpose: string) => {
    const purposes = formData.purposes;
    if (purposes.includes(purpose)) {
      setFormData({
        ...formData,
        purposes: purposes.filter((p) => p !== purpose),
      });
    } else {
      setFormData({
        ...formData,
        purposes: [...purposes, purpose],
      });
    }
  };

  const handleAddDeadline = () => {
    if (newDeadline.amount > 0 && newDeadline.dueDate && newDeadline.percentage > 0) {
      setFormData({
        ...formData,
        paymentDeadlines: [...formData.paymentDeadlines, newDeadline],
      });
      setNewDeadline({ amount: 0, dueDate: "", percentage: 0 });
    }
  };

  const handleRemoveDeadline = (index: number) => {
    setFormData({
      ...formData,
      paymentDeadlines: formData.paymentDeadlines.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      toast.success("Book seller visit logged successfully!");
      console.log("Form submitted:", formData);
      setIsSubmitting(false);
      router.push("/salesman/booksellers");
    }, 1500);
  };

  const selectedSeller = bookSellersData.find((s) => s.id === formData.bookSellerId);

  // Visit purposes relevant to booksellers
  const bookSellerPurposes = [
    "Relationship Building",
    "Payment Collection",
    "Documentation",
    "Inquiry",
    "Sales Return Follow-Up",
  ];

  return (
    <PageContainer>
      <div className="mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <PageHeader
          title="Add Book Seller Visit"
          description="Log your visit to a book seller"
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Book Seller Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Book Seller</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bookSeller">Book Seller *</Label>
              <Select
                value={formData.bookSellerId}
                onValueChange={(value) => setFormData({ ...formData, bookSellerId: value })}
                required
              >
                <SelectTrigger id="bookSeller">
                  <SelectValue placeholder="Select book seller" />
                </SelectTrigger>
                <SelectContent>
                  {bookSellersData
                    .filter((s) => s.assignedTo === "SM001")
                    .map((seller) => (
                      <SelectItem key={seller.id} value={seller.id}>
                        {seller.shopName} - {seller.ownerName}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {selectedSeller && (
              <Card className="bg-muted/50">
                <CardContent className="pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Current Outstanding</span>
                    <span className="font-medium text-destructive">
                      ₹{(selectedSeller.currentOutstanding / 100000).toFixed(2)}L
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Credit Limit</span>
                    <span className="font-medium">
                      ₹{(selectedSeller.creditLimit / 100000).toFixed(2)}L
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* Purpose of Visit */}
        <Card>
          <CardHeader>
            <CardTitle>Purpose of Visit (Multi-select) *</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {bookSellerPurposes.map((purpose) => (
                <Card
                  key={purpose}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        id={purpose}
                        checked={formData.purposes.includes(purpose)}
                        onCheckedChange={() => handlePurposeToggle(purpose)}
                      />
                      <label htmlFor={purpose} className="font-medium cursor-pointer flex-1">
                        {purpose}
                      </label>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payment Collection */}
        {formData.purposes.includes("Payment Collection") && (
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="paymentCollected">Payment Collected (₹)</Label>
                <Input
                  id="paymentCollected"
                  type="number"
                  min="0"
                  placeholder="Enter amount collected"
                  value={formData.paymentCollected || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      paymentCollected: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payment Follow-Up / Deadlines */}
        <Card>
          <CardHeader>
            <CardTitle>Set Payment Deadlines (Optional)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  placeholder="Amount"
                  value={newDeadline.amount || ""}
                  onChange={(e) =>
                    setNewDeadline({
                      ...newDeadline,
                      amount: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={newDeadline.dueDate}
                  onChange={(e) =>
                    setNewDeadline({ ...newDeadline, dueDate: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="percentage">Percentage</Label>
                <Input
                  id="percentage"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="%"
                  value={newDeadline.percentage || ""}
                  onChange={(e) =>
                    setNewDeadline({
                      ...newDeadline,
                      percentage: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddDeadline}
              disabled={
                !newDeadline.amount || !newDeadline.dueDate || !newDeadline.percentage
              }
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Deadline
            </Button>

            {formData.paymentDeadlines.length > 0 && (
              <div className="space-y-2 mt-4">
                <Label>Added Deadlines</Label>
                {formData.paymentDeadlines.map((deadline, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">₹{deadline.amount.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">
                            Due: {new Date(deadline.dueDate).toLocaleDateString()} -{" "}
                            {deadline.percentage}%
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveDeadline(index)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Visit Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any additional notes about the visit..."
                rows={6}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end gap-3 pb-6">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || !formData.bookSellerId || formData.purposes.length === 0}>
            {isSubmitting ? "Submitting..." : "Submit Visit"}
          </Button>
        </div>
      </form>
    </PageContainer>
  );
}

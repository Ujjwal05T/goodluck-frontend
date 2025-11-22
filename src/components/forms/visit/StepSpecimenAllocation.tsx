"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import specimensData from "@/lib/mock-data/specimens.json";
import dropdownOptions from "@/lib/mock-data/dropdown-options.json";

interface StepProps {
  formData: any;
  updateFormData: (data: any) => void;
}

export default function StepSpecimenAllocation({ formData, updateFormData }: StepProps) {
  const [selectedSpecimen, setSelectedSpecimen] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [returnSpecimen, setReturnSpecimen] = useState("");
  const [returnQuantity, setReturnQuantity] = useState(1);
  const [returnCondition, setReturnCondition] = useState("");

  // Filter specimens for current salesman (SM001)
  const availableSpecimens = specimensData.filter(
    (s) => s.allocated["SM001"] && s.allocated["SM001"] > 0
  );

  const handleAddSpecimen = () => {
    if (selectedSpecimen && quantity > 0) {
      const specimen = availableSpecimens.find((s) => s.id === selectedSpecimen);
      if (specimen) {
        const cost = (specimen.mrp * quantity) / 2; // 50% of MRP
        const specimensGiven = formData.specimensGiven || [];
        updateFormData({
          specimensGiven: [
            ...specimensGiven,
            {
              subject: specimen.subject,
              class: specimen.class,
              book: specimen.bookName,
              quantity,
              cost,
              mrp: specimen.mrp,
            },
          ],
        });
        setSelectedSpecimen("");
        setQuantity(1);
      }
    }
  };

  const handleRemoveSpecimen = (index: number) => {
    const specimensGiven = formData.specimensGiven || [];
    updateFormData({
      specimensGiven: specimensGiven.filter((_: any, i: number) => i !== index),
    });
  };

  const handleAddReturn = () => {
    if (returnSpecimen && returnQuantity > 0 && returnCondition) {
      const specimen = availableSpecimens.find((s) => s.id === returnSpecimen);
      if (specimen) {
        const specimensReturned = formData.specimensReturned || [];
        updateFormData({
          specimensReturned: [
            ...specimensReturned,
            {
              subject: specimen.subject,
              class: specimen.class,
              book: specimen.bookName,
              quantity: returnQuantity,
              condition: returnCondition,
            },
          ],
        });
        setReturnSpecimen("");
        setReturnQuantity(1);
        setReturnCondition("");
      }
    }
  };

  const handleRemoveReturn = (index: number) => {
    const specimensReturned = formData.specimensReturned || [];
    updateFormData({
      specimensReturned: specimensReturned.filter((_: any, i: number) => i !== index),
    });
  };

  const totalCost = (formData.specimensGiven || []).reduce(
    (sum: number, item: any) => sum + item.cost,
    0
  );

  return (
    <div className="space-y-6">
      {/* Specimen Given Section */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Specimens Given *</Label>

        {/* Add Specimen Form */}
        <Card>
          <CardContent className="pt-6 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2">
                <Select value={selectedSpecimen} onValueChange={setSelectedSpecimen}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select specimen book" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSpecimens.map((specimen) => (
                      <SelectItem key={specimen.id} value={specimen.id}>
                        {specimen.bookName} - Class {specimen.class} ({specimen.subject})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Input
                type="number"
                min="1"
                placeholder="Qty"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddSpecimen}
              disabled={!selectedSpecimen || quantity < 1}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Specimen
            </Button>
          </CardContent>
        </Card>

        {/* Specimens Given List */}
        {formData.specimensGiven && formData.specimensGiven.length > 0 ? (
          <div className="space-y-2">
            {formData.specimensGiven.map((item: any, index: number) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="font-medium">{item.book}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.subject} - Class {item.class}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary">Qty: {item.quantity}</Badge>
                        <Badge variant="outline">₹{item.cost.toLocaleString()}</Badge>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveSpecimen(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">Total Specimen Cost</p>
                  <p className="text-lg font-bold text-primary">
                    ₹{totalCost.toLocaleString()}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  (Calculated at 50% of MRP)
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4 bg-muted/50 rounded-lg">
            No specimens added yet. Add at least one specimen book.
          </p>
        )}
      </div>

      <Separator />

      {/* Specimen Return Section */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Specimens Returned (Optional)</Label>

        {/* Add Return Form */}
        <Card>
          <CardContent className="pt-6 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Select value={returnSpecimen} onValueChange={setReturnSpecimen}>
                <SelectTrigger>
                  <SelectValue placeholder="Select book" />
                </SelectTrigger>
                <SelectContent>
                  {availableSpecimens.map((specimen) => (
                    <SelectItem key={specimen.id} value={specimen.id}>
                      {specimen.bookName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                min="1"
                placeholder="Quantity"
                value={returnQuantity}
                onChange={(e) => setReturnQuantity(parseInt(e.target.value) || 1)}
              />
            </div>
            <Select value={returnCondition} onValueChange={setReturnCondition}>
              <SelectTrigger>
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                {dropdownOptions.specimenConditions.map((condition) => (
                  <SelectItem key={condition} value={condition}>
                    {condition}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddReturn}
              disabled={!returnSpecimen || !returnCondition || returnQuantity < 1}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Return
            </Button>
          </CardContent>
        </Card>

        {/* Returns List */}
        {formData.specimensReturned && formData.specimensReturned.length > 0 && (
          <div className="space-y-2">
            {formData.specimensReturned.map((item: any, index: number) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="font-medium">{item.book}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.subject} - Class {item.class}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary">Qty: {item.quantity}</Badge>
                        <Badge
                          variant={
                            item.condition === "Good" ? "default" : "destructive"
                          }
                        >
                          {item.condition}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveReturn(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

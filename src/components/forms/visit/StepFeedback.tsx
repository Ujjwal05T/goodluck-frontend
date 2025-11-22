"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

import dropdownOptions from "@/lib/mock-data/dropdown-options.json";

interface StepProps {
  formData: any;
  updateFormData: (data: any) => void;
}

export default function StepFeedback({ formData, updateFormData }: StepProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-3 mb-4">
            <MessageSquare className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <h4 className="font-medium">Product Feedback</h4>
              <p className="text-sm text-muted-foreground">
                Your feedback will be sent to the Product Managers
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Feedback Category */}
            <div className="space-y-2">
              <Label htmlFor="feedbackCategory">Feedback Category (Optional)</Label>
              <Select
                value={formData.feedbackCategory}
                onValueChange={(value) => updateFormData({ feedbackCategory: value })}
              >
                <SelectTrigger id="feedbackCategory">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {dropdownOptions.feedbackCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Feedback Comment */}
            <div className="space-y-2">
              <Label htmlFor="feedbackComment">
                Comments (Optional)
              </Label>
              <Textarea
                id="feedbackComment"
                placeholder="Share your observations, feedback, or suggestions about the books, quality, content, pricing, or any other aspect..."
                rows={6}
                value={formData.feedbackComment}
                onChange={(e) => updateFormData({ feedbackComment: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                {formData.feedbackComment?.length || 0} characters
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {!formData.feedbackCategory && !formData.feedbackComment && (
        <p className="text-sm text-muted-foreground text-center py-4 bg-muted/50 rounded-lg">
          Feedback is optional but highly valuable. You can skip this step if you don't have any feedback to share.
        </p>
      )}

      {formData.feedbackCategory && formData.feedbackComment && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <p className="text-sm text-green-800">
              ✓ Your feedback will be sent to the Product Manager for review
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

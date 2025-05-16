"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";

interface FeedbackData {
  technical: string;
  communication: string;
  comments: string;
  status: string;
}

export function GiveFeedbackButton({
  applicationId,
}: {
  applicationId: string;
}) {
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackData>({
    technical: "",
    communication: "",
    comments: "",
    status: "",
  });

  const handleSubmit = () => {
    const { technical, communication, status } = feedback;

    if (!technical || !communication || !status) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // Save to localStorage (mock behavior for frontend-only)
    const existing = JSON.parse(localStorage.getItem("feedbacks") || "{}");
    existing[applicationId] = feedback;
    localStorage.setItem("feedbacks", JSON.stringify(existing));

    toast.success("Feedback and status submitted successfully!");

    setFeedback({
      technical: "",
      communication: "",
      comments: "",
      status: "",
    });
    setOpen(false);
  };

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Give Feedback
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Candidate Feedback</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Technical Knowledge</Label>
              <Select
                value={feedback.technical}
                onValueChange={(val) =>
                  setFeedback((prev) => ({ ...prev, technical: val }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Rate technical knowledge" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((val) => (
                    <SelectItem key={val} value={val.toString()}>
                      {val}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Communication Skills</Label>
              <Select
                value={feedback.communication}
                onValueChange={(val) =>
                  setFeedback((prev) => ({ ...prev, communication: val }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Rate communication" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((val) => (
                    <SelectItem key={val} value={val.toString()}>
                      {val}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Application Status</Label>
              <Select
                value={feedback.status}
                onValueChange={(val) =>
                  setFeedback((prev) => ({ ...prev, status: val }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select application status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CLEARED">Cleared</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                  <SelectItem value="HOLD">Hold</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Comments</Label>
              <Textarea
                value={feedback.comments}
                onChange={(e) =>
                  setFeedback((prev) => ({
                    ...prev,
                    comments: e.target.value,
                  }))
                }
                placeholder="Write your observations here..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleSubmit}>Submit Feedback</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

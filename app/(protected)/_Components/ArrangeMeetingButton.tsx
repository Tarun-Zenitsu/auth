"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function ArrangeMeetingButton({
  applicationId,
}: {
  applicationId: string;
}) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);

  //   const handleSubmit = async () => {
  //     setLoading(true)
  //     const res = await fetch(`/api/technical/arrange-meeting`, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ applicationId, date, time }),
  //     })

  //     if (res.ok) {
  //       alert('Meeting arranged successfully!')
  //       setOpen(false)
  //     } else {
  //       alert('Failed to arrange meeting.')
  //     }

  //     setLoading(false)
  //   }

  const handleSubmit = () => {
    setLoading(true);

    const existingMeetings = JSON.parse(
      localStorage.getItem("meetings") || "{}"
    );
    existingMeetings[applicationId] = { date, time };
    localStorage.setItem("meetings", JSON.stringify(existingMeetings));

    toast.success("Meeting arranged successfully!");

    setOpen(false);
    setLoading(false);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} className="mt-2">
        Arrange Meeting
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Arrange Meeting</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <label>Date</label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <label>Time</label>
            <Input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Scheduling..." : "Confirm Meeting"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

interface ApplyFormDialogProps {
  jobId: string;
}

export const ApplyFormDialog = ({ jobId }: ApplyFormDialogProps) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    candidateName: "",
    email: "",
    resumeLink: "",
    coverLetter: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post("/api/applications", {
        ...form,
        jobId,
      });
      toast.success("Application submitted!");
      setOpen(false);
    } catch (err) {
      console.log(err);
      toast.error("Failed to apply.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Apply</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Apply for Job</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Your Name"
            value={form.candidateName}
            onChange={(e) =>
              setForm((f) => ({ ...f, candidateName: e.target.value }))
            }
            required
          />
          <Input
            type="email"
            placeholder="Your Email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            required
          />
          <Input
            placeholder="Resume Link"
            value={form.resumeLink}
            onChange={(e) =>
              setForm((f) => ({ ...f, resumeLink: e.target.value }))
            }
            required
          />
          <Textarea
            placeholder="Cover Letter (optional)"
            value={form.coverLetter}
            onChange={(e) =>
              setForm((f) => ({ ...f, coverLetter: e.target.value }))
            }
          />
          <Button type="submit" className="w-full">
            Submit Application
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

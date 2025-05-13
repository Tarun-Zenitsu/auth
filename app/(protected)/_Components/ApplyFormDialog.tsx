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
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ApplyFormDialogProps {
  jobId: string;
}

export const ApplyFormDialog = ({ jobId }: ApplyFormDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    candidateName: "",
    email: "",
    resumeLink: "",
    coverLetter: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("/api/applications", {
        ...form,
        jobId,
      });

      toast.success("Application submitted!");
      setOpen(false);
      setForm({
        candidateName: "",
        email: "",
        resumeLink: "",
        coverLetter: "",
      });
    } catch (err: unknown) {
      const error = err as AxiosError; // Type the error to AxiosError
      if (
        error?.response?.status === 400 &&
        error?.response?.data === "You have already applied for this job"
      ) {
        toast.warning("You have already applied for this job.");
      } else {
        toast.error("Failed to submit application.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Apply</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Apply for this Job</DialogTitle>
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
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Application
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

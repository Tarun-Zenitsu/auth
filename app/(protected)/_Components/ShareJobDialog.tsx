"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import { useState } from "react";

interface ShareJobDialogProps {
  requisitionId: string | null;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ShareJobDialog = ({
  requisitionId,
  open,
  onClose,
  onSuccess,
}: ShareJobDialogProps) => {
  const [loading, setLoading] = useState(false);

  const handleShare = async (channel: string) => {
    if (!requisitionId) return;

    try {
      setLoading(true);
      await axios.patch(`/api/requisitions/${requisitionId}/post`, {
        postChannels: [channel],
        expiresAt: null,
      });

      toast.success(`Job posted to ${channel}`);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.log(error);
      toast.error("Error posting job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select a Channel to Share</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-4">
          <Button
            variant="outline"
            disabled={loading}
            onClick={() => handleShare("INTERNAL")}
          >
            Share on Internal Website
          </Button>
          <Button
            variant="outline"
            disabled={loading}
            onClick={() => handleShare("LINKEDIN")}
          >
            Share on LinkedIn
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

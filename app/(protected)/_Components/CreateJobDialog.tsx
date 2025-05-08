import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { NewJobForm } from "../_Components/NewJobForm";

const CreateJobDialog = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
}) => (
  <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild>
      <Button>
        <Plus className="w-4 h-4 mr-2" /> Create New Job
      </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create a New Job Posting</DialogTitle>
      </DialogHeader>
      <NewJobForm onSuccess={() => setOpen(false)} />
    </DialogContent>
  </Dialog>
);

export default CreateJobDialog;

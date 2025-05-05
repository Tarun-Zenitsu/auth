"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { FormSuccess } from "@/components/form-success";
import { useCurrentUser } from "@/hooks/use-current-user";

interface NewJobFormProps {
  onSuccess?: () => void;
}

export const NewJobForm: React.FC<NewJobFormProps> = ({ onSuccess }) => {
  const user = useCurrentUser();
  console.log(user);
  const [formData, setFormData] = useState({
    jobTitle: "",
    department: "",
    budgetCode: "",
    justification: "",
    skillTags: "",
    urgency: "",
    location: "",
    salaryRange: "",
    jobDescription: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUrgencyChange = (value: string) => {
    setFormData((prev) => ({ ...prev, urgency: value.toUpperCase() }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/requisitions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          skillTags: formData.skillTags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
          createdById: user?.id,
          openings: 1,
        }),
      });

      if (response.ok) {
        setSuccessMessage("Job created successfully.");
        setFormData({
          jobTitle: "",
          department: "",
          budgetCode: "",
          justification: "",
          skillTags: "",
          urgency: "",
          location: "",
          salaryRange: "",
          jobDescription: "",
        });
        onSuccess?.();
      } else {
        console.error("Failed to create job");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {successMessage && <FormSuccess message={successMessage} />}

      <Input
        name="jobTitle"
        value={formData.jobTitle}
        onChange={handleChange}
        placeholder="Job Title"
        required
      />
      <Input
        name="department"
        value={formData.department}
        onChange={handleChange}
        placeholder="Department"
        required
      />
      <Input
        name="budgetCode"
        value={formData.budgetCode}
        onChange={handleChange}
        placeholder="Budget Code"
      />
      <Textarea
        name="justification"
        value={formData.justification}
        onChange={handleChange}
        placeholder="Justification"
        rows={3}
      />
      <Textarea
        name="jobDescription"
        value={formData.jobDescription}
        onChange={handleChange}
        placeholder="Job Description"
        rows={4}
      />
      <Input
        name="skillTags"
        value={formData.skillTags}
        onChange={handleChange}
        placeholder="e.g., React, Node.js"
      />
      <Select onValueChange={handleUrgencyChange} defaultValue="">
        <SelectTrigger>
          <span>{formData.urgency || "Select urgency"}</span>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="low">Low</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="high">High</SelectItem>
          <SelectItem value="critical">Critical</SelectItem>
        </SelectContent>
      </Select>
      <Input
        name="location"
        value={formData.location}
        onChange={handleChange}
        placeholder="Location (e.g., Remote)"
      />
      <Input
        name="salaryRange"
        value={formData.salaryRange}
        onChange={handleChange}
        placeholder="Salary Range (e.g., $80k - $100k)"
      />

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Posting..." : "Post Job"}
        </Button>
      </div>
    </form>
  );
};

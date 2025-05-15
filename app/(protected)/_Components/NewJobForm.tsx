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

  const [formData, setFormData] = useState({
    jobTitle: "",
    department: "",
    budgetCode: "",
    justification: "",
    skillTags: [] as string[],
    urgency: "",
    location: "",
    salaryRange: "",
    jobDescription: "",
  });

  const [skillInput, setSkillInput] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
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
          skillTags: [],
          urgency: "",
          location: "",
          salaryRange: "",
          jobDescription: "",
        });
        setSkillInput("");
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

      {/* Job Title Dropdown */}
      <Select
        onValueChange={(val) => handleSelectChange("jobTitle", val)}
        defaultValue=""
      >
        <SelectTrigger>
          <span>{formData.jobTitle || "Select Job Title"}</span>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Software Engineer">Software Engineer</SelectItem>
          <SelectItem value="Frontend Developer">Frontend Developer</SelectItem>
          <SelectItem value="Backend Developer">Backend Developer</SelectItem>
          <SelectItem value="DevOps Engineer">DevOps Engineer</SelectItem>
          <SelectItem value="QA Engineer">QA Engineer</SelectItem>
        </SelectContent>
      </Select>

      {/* Department Dropdown */}
      <Select
        onValueChange={(val) => handleSelectChange("department", val)}
        defaultValue=""
      >
        <SelectTrigger>
          <span>{formData.department || "Select Department"}</span>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Engineering">Engineering</SelectItem>
          <SelectItem value="Product">Product</SelectItem>
          <SelectItem value="Design">Design</SelectItem>
          <SelectItem value="QA">QA</SelectItem>
          <SelectItem value="IT">IT</SelectItem>
        </SelectContent>
      </Select>

      {/* Budget Code Dropdown */}
      <Select
        onValueChange={(val) => handleSelectChange("budgetCode", val)}
        defaultValue=""
      >
        <SelectTrigger>
          <span>{formData.budgetCode || "Select Budget Code"}</span>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="DEV123">DEV123</SelectItem>
          <SelectItem value="PROD456">PROD456</SelectItem>
          <SelectItem value="DES789">DES789</SelectItem>
          <SelectItem value="QA321">QA321</SelectItem>
          <SelectItem value="IT654">IT654</SelectItem>
        </SelectContent>
      </Select>

      {/* Justification */}
      <Textarea
        name="justification"
        value={formData.justification}
        onChange={handleChange}
        placeholder="Justification"
        rows={3}
      />

      {/* Job Description */}
      <Textarea
        name="jobDescription"
        value={formData.jobDescription}
        onChange={handleChange}
        placeholder="Job Description"
        rows={4}
      />

      {/* Skill Tags as Chips */}
      <div>
        <label className="block text-sm font-medium mb-1">Skills</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.skillTags.map((tag, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full flex items-center gap-1"
            >
              {tag}
              <button
                type="button"
                className="text-blue-500 hover:text-red-600"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    skillTags: prev.skillTags.filter((_, i) => i !== index),
                  }))
                }
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <Input
          type="text"
          value={skillInput}
          onChange={(e) => setSkillInput(e.target.value)}
          onKeyDown={(e) => {
            if ((e.key === "Enter" || e.key === ",") && skillInput.trim()) {
              e.preventDefault();
              const newSkill = skillInput.trim();
              if (!formData.skillTags.includes(newSkill)) {
                setFormData((prev) => ({
                  ...prev,
                  skillTags: [...prev.skillTags, newSkill],
                }));
              }
              setSkillInput("");
            }
          }}
          placeholder="Type a skill and press Enter or comma"
        />
      </div>

      {/* Urgency Dropdown */}
      <Select
        onValueChange={(val) => handleSelectChange("urgency", val)}
        defaultValue=""
      >
        <SelectTrigger>
          <span>{formData.urgency || "Select urgency"}</span>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="LOW">Low</SelectItem>
          <SelectItem value="MEDIUM">Medium</SelectItem>
          <SelectItem value="HIGH">High</SelectItem>
        </SelectContent>
      </Select>

      {/* Location */}
      <Input
        name="location"
        value={formData.location}
        onChange={handleChange}
        placeholder="Location (e.g., Remote)"
      />

      {/* Salary Range */}
      <Input
        name="salaryRange"
        value={formData.salaryRange}
        onChange={handleChange}
        placeholder="Salary Range (e.g., $80k - $100k)"
      />

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Posting..." : "Post Job"}
        </Button>
      </div>
    </form>
  );
};

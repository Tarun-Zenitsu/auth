// Update CandidateDashboard component
"use client";

import { FormSuccess } from "@/components/form-success";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const CandidateDashboard = () => {
  return (
    <Card className="w-full max-w-3xl mx-auto mt-10">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">
          Candidate Dashboard
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormSuccess message="Welcome to your Candidate Dashboard!" />
        <div className="text-center text-muted-foreground">
          Here you’ll find your job applications, interview status, and
          messages.
        </div>
      </CardContent>
    </Card>
  );
};

export default CandidateDashboard;

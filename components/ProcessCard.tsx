"use client";

import Link from "next/link";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

export function ProcessCard({
  id,
  title,
  description,
}: {
  id: string;
  title: string;
  description: string;
}) {
  return (
    <Link href={`/details/${id}`}>
      <Card className="hover:shadow-lg transition cursor-pointer">
        <CardContent className="p-4">
          <CardTitle className="text-xl">{title}</CardTitle>
          <p className="text-sm text-muted-foreground mt-2">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}

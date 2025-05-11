"use client";

import React from "react";
import { Card, CardFooter, CardContent, CardHeader } from "../ui/card";
import { Header } from "./header";
import { Social } from "./social";
import { BackButton } from "./back-button";

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLable: string;
  backButtonHref: string;
  showSocial?: boolean;
  heading: string;
}

export const CardWrapper = ({
  children,
  headerLabel,
  backButtonHref,
  showSocial,
  backButtonLable,
  heading,
}: CardWrapperProps) => {
  return (
    <Card className="w-[400px] shadow-md">
      <CardHeader>
        <Header label={headerLabel} heading={heading} />
      </CardHeader>
      <CardContent>{children}</CardContent>
      {showSocial && (
        <CardFooter>
          <Social />
        </CardFooter>
      )}
      <CardFooter>
        <BackButton label={backButtonLable} href={backButtonHref} />
      </CardFooter>
    </Card>
  );
};

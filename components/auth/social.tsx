"use client";
import { FcGoogle } from "react-icons/fc";
import { FaMicrosoft } from "react-icons/fa";
import { Button } from "../ui/button";
export const Social = () => {
  return (
    <div className="flex items-center w-full gap-x-2">
      <Button className="flex-1" size="lg" variant="outline" onClick={() => {}}>
        <FcGoogle className="h-5 w-5" />
      </Button>
      <Button className="flex-1" size="lg" variant="outline" onClick={() => {}}>
        <FaMicrosoft className="h-5 w-5" />
      </Button>
    </div>
  );
};

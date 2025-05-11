import Image from "next/image";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

interface HeaderProps {
  label: string;
  heading: string;
}

export const Header = ({ label, heading }: HeaderProps) => {
  return (
    <div className="w-full flex flex-col gap-y-4 items-center justify-center">
      {/* Logo + Title */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full overflow-hidden">
          <Image
            src="/logo2.png"
            alt="Logo"
            width={32}
            height={32}
            className="object-cover"
          />
        </div>
        <h1 className={cn("text-3xl font-semibold", font.className)}>
          {heading}
        </h1>
      </div>

      {/* Subtitle */}
      <p className="text-muted-foreground text-sm">{label}</p>
    </div>
  );
};

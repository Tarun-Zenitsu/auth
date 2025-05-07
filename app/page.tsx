import { LoginButton } from "@/components/auth/login-button";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <main className="bg-gradient-to-b bg-green-300 from-sky-400 to-blue-500 h-screen flex flex-col items-center justify-center gap-2">
      <div className="space-y-6 text-center">
        <div className="flex flex-row gap-2">
          <Image
            src="/logo.jpeg"
            alt="logo"
            height={45}
            width={45}
            className=" rounded-md object-cover"
          />

          <h1 className="text-5xl font-semibold text-white">Auth</h1>
        </div>
      </div>
      <div>
        <LoginButton>
          <Button variant="secondary" size="lg">
            Sign In
          </Button>
        </LoginButton>
      </div>
    </main>
  );
}

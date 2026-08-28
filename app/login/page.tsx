"use client";

import AuthForm from "@/components/AuthForm";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#eef3f7] px-4 py-12">
      <AuthForm onSuccess={() => router.push("/")} />
    </div>
  );
}

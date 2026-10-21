import type { Metadata } from "next";
import { RegisterForm } from "@/components/register-form";

export const metadata: Metadata = { title: "Join the community" };
export default function RegisterPage() {
  return <RegisterForm />;
}

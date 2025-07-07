"use client";
import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div className="h-screen flex justify-center items-center">
      <SignIn path="/login" routing="path" signUpUrl="/signup" />
    </div>
  );
}   

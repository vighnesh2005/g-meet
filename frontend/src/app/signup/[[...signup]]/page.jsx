"use client";
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="h-screen flex justify-center items-center">
      <SignUp
        path="/signup"
        routing="path"
        signInUrl="/login"  
        additionalFields={[
          {
            name: "first_name",
            label: "First Name",
            type: "text",
            required: true,
          },
          { 
            name: "last_name",
            label: "Last Name",
            type: "text",
            required: true,
          },
        ]}
      />
    </div>
  );
}

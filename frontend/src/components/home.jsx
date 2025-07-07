"use client";

import { SignOutButton, SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { useUserSync } from "@/hooks/useUserSync";


export default function Home() {
  useUserSync();
  const { user, isLoaded } = useUser();


    return (
    <>
        <SignedIn>
        <div className="h-screen flex flex-col justify-center items-center">
          <h1 className="text-3xl font-bold">
            Welcome to Google Meet Clone 
          </h1>
          <SignOutButton>
            <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
              Sign Out
            </button>
          </SignOutButton>
        </div>
      </SignedIn>

      <SignedOut>
        <div className="h-screen flex justify-center items-center">
          <h1 className="text-3xl font-bold">Please Sign In</h1>
        </div>
      </SignedOut>
    </>
  );
}
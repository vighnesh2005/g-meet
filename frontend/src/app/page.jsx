"use client"; 
import { SignOutButton } from "@clerk/nextjs";
import { useUserSync } from "@/hooks/useUserSync.js";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export default function Home() {
  useUserSync();
  return (
    <>
    <SignedIn>
      <div className="h-screen flex justify-center items-center">
        <h1 className="text-3xl font-bold">Welcome to Google Meet Clone</h1>
      </div>
      <SignOutButton>
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            Sign Out
          </button>
        </SignOutButton>
    </SignedIn>
    <div>
      <SignedOut>
        <div className="h-screen flex justify-center items-center">
          <h1 className="text-3xl font-bold">Please Sign In</h1>
        </div>
      </SignedOut>
      <div className="flex justify-center mt-4">
        
      </div>
    </div>
    </>    
  );
}

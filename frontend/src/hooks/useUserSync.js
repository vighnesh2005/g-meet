"use client";

import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/userSlice"; // Adjust the import based on your store structure

export const useUserSync = () => {
  const { getToken, signOut } = useAuth();
  const { isSignedIn, user } = useUser();
  const [synced, setSynced] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const sync = async () => {
      if (!isSignedIn || !user || synced) return;

      try {
        const token = await getToken();

        await axios.post(
          "http://localhost:5000/api/auth/sync",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        setSynced(true);
      } catch (error) {
        console.error("Auth sync/verify failed:", error);
        await signOut();
      }

    };
    sync();
    const verify = async () =>{
       const res = await axios.post(
          "http://localhost:5000/api/auth/verify",
          {},
          {
            withCredentials: true,
          }
        );

        if (res.status !== 200) {
          console.warn("Token verification failed. Signing out...");
          await signOut();
        } else {
          console.log("✅ Token verified successfully");
        }

        // Fetch user data from backend
        const userRes = await axios.get("http://localhost:5000/api/auth/user", {
          withCredentials: true,
        });

        const { _id, email, firstName, lastName, profile, color } = userRes.data;

        dispatch(setUser({
          id: _id,
          email,
          firstName,
          lastName,
          profile,
          color // Default color if not provided
        }));
        console.log("User data fetched and stored in Redux:", userRes.data);
    }
    verify();
  }, [isSignedIn, user, getToken, synced, signOut]); // ✅ added `dispatch` to deps
};

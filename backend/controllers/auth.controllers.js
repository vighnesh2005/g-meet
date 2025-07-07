import jwt from "jsonwebtoken";
import { clerkClient, verifyToken } from "@clerk/clerk-sdk-node";
import User from "../models/user.model.js";
import dotenv from "dotenv";

dotenv.config();

function getRandomColor() {
  const colors = [
    "#FF5733", "#33FF57", "#3357FF", "#FF33A6", "#FFD433",
    "#33FFF2", "#9B59B6", "#E67E22", "#1ABC9C", "#F1C40F"
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}


export const sync = async (req,  res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token provided" });

    const sessionClaims = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    const clerkUser = await clerkClient.users.getUser(sessionClaims.sub);
    const { emailAddresses, firstName, lastName, id: clerkId, imageUrl, externalAccounts } = clerkUser;

    const rawProvider = externalAccounts?.[0]?.provider || "email";
    const authProvider =
      rawProvider === "oauth_google" ? "google" :
      rawProvider === "oauth_github" ? "github" :
      "email";

    let user = await User.findOne({ clerkId });

    if (!user) {
      const email = emailAddresses[0].emailAddress;

      user = await User.create({
        clerkId,
        email,
        firstName: firstName || "",
        lastName: lastName || "",
        authProvider,
        color: getRandomColor(),
      });
    }


    const myJwt = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", myJwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    
    });

    console.log("User synced successfully:", user._id);
    res.status(201).json({ success: true });
  } catch (err) {
    console.error("Token verification failed:", err.message);
    res.status(401).json({ error: "Invalid token", details: err.message });
  }
}

export const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ success: true });
};

export const verify = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.id) {
      return res.status(401).json({ error: "Invalid token" });
    }

        const refreshedToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", refreshedToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });    

    res.status(200).json({ success: true });

  } catch (err) {
    console.error("Token verification failed:", err.message);
    res.status(401).json({ error: "Invalid token", details: err.message });
  }
}

export const getUser = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.id) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const user = await User.findById(decoded.id).select("-__v -password");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err.message);
    res.status(500).json({ error: "Internal server error", details: err.message });
  }
}
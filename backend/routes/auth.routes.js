import express from "express";
import { sync, logout, verify, getUser } from "../controllers/auth.controllers.js";
import dotenv from "dotenv";
import  checkToken from "../utils/verifyToken.js";

dotenv.config();

function getRandomColor() {
  const colors = [
    "#FF5733", "#33FF57", "#3357FF", "#FF33A6", "#FFD433",
    "#33FFF2", "#9B59B6", "#E67E22", "#1ABC9C", "#F1C40F"
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

const router = express.Router();

router.post("/sync",sync);

router.post("/logout",logout);

router.post("/verify", checkToken,verify);

router.get("/user", checkToken, getUser);

export default router;

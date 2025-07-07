import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export default function requireAuth(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized - no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT Error:", err.message);

    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });

    return res.status(401).json({ error: "Unauthorized - invalid or expired token" });
  }
}

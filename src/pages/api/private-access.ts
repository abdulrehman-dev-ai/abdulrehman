import { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";

// Configuration
// Default Password: "EmergencyAccess"
// SHA-256 Hash of "EmergencyAccess"
const PASSWORD_HASH = "113cf8808c33a2b4442b9ca943160679fd1089608332d416fe089365080b5496";

// Base64 encoded Google Drive Link (Replace with your actual link)
// Currently points to: https://drive.google.com/
const ENCODED_LINK = "aHR0cHM6Ly9kcml2ZS5nb29nbGUuY29tL2RyaXZlL2ZvbGRlcnMvMVhyYjZFTXN2cXlmWjlDVm51NE1adTJGUkQwMDJFVDVLP3VzcD1zaGFyaW5n";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password required" });
    }

    // Verify password
    const hash = crypto.createHash("sha256").update(password).digest("hex");

    if (hash === PASSWORD_HASH) {
      // Decode link
      const link = Buffer.from(ENCODED_LINK, "base64").toString("utf-8");
      return res.status(200).json({ url: link });
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

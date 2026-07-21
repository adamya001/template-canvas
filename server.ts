import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import crypto from "crypto";
import Razorpay from "razorpay";
import { createClerkClient, verifyToken } from "@clerk/backend";
import { Template, CanvasElement, Design, User } from "./src/types";
import { DEFAULT_TEMPLATES } from "./src/defaultTemplates";

// Load environment variables
dotenv.config();

// Initialize Clerk client
const clerkSecretKey = process.env.CLERK_SECRET_KEY || "sk_test_gZYDbEuOvVhuqTPe5fVmG929kwccwLG51O6NDTxspe";
const clerk = createClerkClient({ secretKey: clerkSecretKey });

async function getUserIdFromRequest(req: express.Request): Promise<string | null> {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return null;
  }
  const token = authHeader.replace("Bearer ", "");
  if (!token) {
    return null;
  }
  
  // Backward compatibility fallback for legacy mock tokens
  if (token.startsWith("mock-token-")) {
    return token.replace("mock-token-", "");
  }

  try {
    const verifiedToken = await verifyToken(token, {
      secretKey: clerkSecretKey,
    });
    return verifiedToken.sub || null; // Clerk User ID
  } catch (err: any) {
    console.error("Clerk Token verification failed:", err.message);
    return null;
  }
}

async function isAdminUser(userId: string): Promise<boolean> {
  if (userId === "usr-admin" || userId === "admin") {
    return true;
  }
  try {
    const user = await clerk.users.getUser(userId);
    const email = user.emailAddresses[0]?.emailAddress || "";
    const username = user.username || "";
    return email === "warlockadam234@gmail.com" || username.toLowerCase().startsWith("admin");
  } catch (err) {
    console.error("Failed to check admin status for user:", userId, err);
    return false;
  }
}

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Enable JSON body parsing with increased limit for base64 PDF uploads
app.use(express.json({ limit: "50mb" }));

// Paths for persistent JSON file-based database
const DB_DIR = process.env.DB_DIR ? path.resolve(process.env.DB_DIR) : path.join(process.cwd(), "data");
const USERS_FILE = path.join(DB_DIR, "users.json");
const TEMPLATES_FILE = path.join(DB_DIR, "templates.json");
const DESIGNS_FILE = path.join(DB_DIR, "designs.json");

// Ensure database directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Initial default templates seed
// Templates loaded from defaultTemplates.ts package

// Database Helper functions
const loadData = <T>(filePath: string, defaultVal: T): T => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultVal, null, 2), "utf8");
    return defaultVal;
  }
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data) as T;
  } catch (e) {
    console.error(`Error reading database file ${filePath}:`, e);
    return defaultVal;
  }
};

const saveData = <T>(filePath: string, data: T): void => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
  } catch (e) {
    console.error(`Error saving database file ${filePath}:`, e);
  }
};

// Seed/Load database arrays
let users: User[] = loadData<User[]>(USERS_FILE, [
  { id: "usr-admin", username: "admin", name: "Super Admin", role: "admin" },
  { id: "usr-user", username: "user", name: "Guest User", role: "user" }
]);

let templates: Template[] = loadData<Template[]>(TEMPLATES_FILE, DEFAULT_TEMPLATES);
if (templates.length < DEFAULT_TEMPLATES.length) {
  templates = DEFAULT_TEMPLATES;
  saveData(TEMPLATES_FILE, templates);
}
let designs: Design[] = loadData<Design[]>(DESIGNS_FILE, []);

// API: Auth Routes
app.post("/api/auth/signup", (req, res) => {
  const { username, name, role } = req.body;
  if (!username || !name) {
    return res.status(400).json({ error: "Username and Name are required" });
  }

  const existing = users.find(u => u.username.toLowerCase() === username.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: "Username is already taken" });
  }

  const newUser: User = {
    id: `usr-${Date.now()}`,
    username,
    name,
    role: role === "admin" ? "admin" : "user"
  };

  users.push(newUser);
  saveData(USERS_FILE, users);

  res.json({ user: newUser, token: `mock-token-${newUser.id}` });
});

app.post("/api/auth/login", (req, res) => {
  const { username, role } = req.body;
  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  const user = users.find(
    u => u.username.toLowerCase() === username.toLowerCase() && u.role === role
  );

  if (!user) {
    return res.status(401).json({ error: `No registered ${role} found with username "${username}"` });
  }

  res.json({ user, token: `mock-token-${user.id}` });
});

app.post("/api/auth/google", (req, res) => {
  const { email, name, role } = req.body;
  if (!email || !name) {
    return res.status(400).json({ error: "Google verification email missing" });
  }

  // Find or create user
  const username = email.split("@")[0];
  let user = users.find(u => u.username.toLowerCase() === username.toLowerCase());

  if (!user) {
    user = {
      id: `usr-google-${Date.now()}`,
      username,
      name,
      role: role === "admin" ? "admin" : "user"
    };
    users.push(user);
    saveData(USERS_FILE, users);
  }

  res.json({ user, token: `mock-token-${user.id}` });
});

// API: Template Routes
app.get("/api/templates", (req, res) => {
  res.json(templates);
});

// Create Preset Template (Admin Only)
app.post("/api/templates", async (req, res) => {
  const userId = await getUserIdFromRequest(req);
  if (!userId || !(await isAdminUser(userId))) {
    return res.status(403).json({ error: "Access denied. Admin authorization required." });
  }

  const { title, category, description, backgroundColor, elements } = req.body;
  if (!title || !category || !elements) {
    return res.status(400).json({ error: "Missing required fields for template creation." });
  }

  const newTemplate: Template = {
    id: `tpl-${Date.now()}`,
    title,
    category,
    description: description || "Custom template designed by admin.",
    backgroundColor: backgroundColor || "#FFFFFF",
    width: 600,
    height: 800,
    elements,
    isAdminPreset: true
  };

  templates.push(newTemplate);
  saveData(TEMPLATES_FILE, templates);
  res.json(newTemplate);
});

// Delete Preset Template (Admin Only)
app.delete("/api/templates/:id", async (req, res) => {
  const userId = await getUserIdFromRequest(req);
  if (!userId || !(await isAdminUser(userId))) {
    return res.status(403).json({ error: "Access denied. Admin authorization required." });
  }

  const { id } = req.params;
  const initialLen = templates.length;
  templates = templates.filter(t => t.id !== id);
  
  if (templates.length === initialLen) {
    return res.status(404).json({ error: "Template not found" });
  }

  saveData(TEMPLATES_FILE, templates);
  res.json({ success: true, message: "Template removed successfully." });
});

// API: Design Routes
app.get("/api/designs", async (req, res) => {
  const userId = await getUserIdFromRequest(req);
  if (!userId) {
    return res.status(401).json({ error: "Authentication token invalid or missing." });
  }

  const userDesigns = designs.filter(d => d.userId === userId);
  res.json(userDesigns);
});

app.post("/api/designs", async (req, res) => {
  const userId = await getUserIdFromRequest(req);
  if (!userId) {
    return res.status(401).json({ error: "Authentication token invalid or missing." });
  }

  const { templateId, title, category, backgroundColor, elements } = req.body;

  if (!title || !category || !elements) {
    return res.status(400).json({ error: "Missing title, category or elements." });
  }

  const newDesign: Design = {
    id: `dsg-${Date.now()}`,
    userId,
    templateId: templateId || "scratch",
    title,
    category,
    backgroundColor: backgroundColor || "#FFFFFF",
    elements,
    createdAt: new Date().toISOString()
  };

  designs.push(newDesign);
  saveData(DESIGNS_FILE, designs);
  res.json(newDesign);
});

app.put("/api/designs/:id", async (req, res) => {
  const userId = await getUserIdFromRequest(req);
  if (!userId) {
    return res.status(401).json({ error: "Authentication token invalid or missing." });
  }

  const { id } = req.params;
  const { title, backgroundColor, elements } = req.body;

  const designIndex = designs.findIndex(d => d.id === id);
  if (designIndex === -1) {
    return res.status(404).json({ error: "Design not found" });
  }

  // Ensure owner authorization
  if (designs[designIndex].userId !== userId) {
    return res.status(403).json({ error: "Access denied. You do not own this design." });
  }

  designs[designIndex].title = title || designs[designIndex].title;
  designs[designIndex].backgroundColor = backgroundColor || designs[designIndex].backgroundColor;
  designs[designIndex].elements = elements || designs[designIndex].elements;

  saveData(DESIGNS_FILE, designs);
  res.json(designs[designIndex]);
});

app.delete("/api/designs/:id", async (req, res) => {
  const userId = await getUserIdFromRequest(req);
  if (!userId) {
    return res.status(401).json({ error: "Authentication token invalid or missing." });
  }

  const { id } = req.params;
  const designIndex = designs.findIndex(d => d.id === id);
  if (designIndex === -1) {
    return res.status(404).json({ error: "Design not found" });
  }

  // Ensure owner authorization
  if (designs[designIndex].userId !== userId) {
    return res.status(403).json({ error: "Access denied. You do not own this design." });
  }

  designs = designs.filter(d => d.id !== id);
  saveData(DESIGNS_FILE, designs);
  res.json({ success: true });
});

// PDF storage & upload endpoints
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.post("/api/upload-pdf", (req, res) => {
  const { fileName, pdfBase64 } = req.body;
  if (!fileName || !pdfBase64) {
    return res.status(400).json({ error: "Missing fileName or pdfBase64" });
  }
  try {
    const base64Data = pdfBase64.includes(",") ? pdfBase64.split(",")[1] : pdfBase64;
    const filePath = path.join(uploadsDir, fileName);
    fs.writeFileSync(filePath, base64Data, "base64");

    // Determine the real public base URL of the Cloud Run app
    let publicUrlBase = process.env.APP_URL || "";
    if (publicUrlBase === "MY_APP_URL" || !publicUrlBase) {
      // Fallback: construct from request headers
      const host = req.headers["x-forwarded-host"] || req.headers.host || "";
      const proto = req.headers["x-forwarded-proto"] || "http";
      publicUrlBase = host ? `${proto}://${host}` : "";
    }

    // Strip trailing slash if present
    if (publicUrlBase.endsWith("/")) {
      publicUrlBase = publicUrlBase.slice(0, -1);
    }

    // Ensure we do not use aistudio.google.com as the domain for shared PDF URLs
    if (publicUrlBase.includes("aistudio.google.com")) {
      const forwardHost = req.headers["x-forwarded-host"];
      if (forwardHost && typeof forwardHost === "string" && !forwardHost.includes("aistudio.google.com")) {
        const proto = req.headers["x-forwarded-proto"] || "https";
        publicUrlBase = `${proto}://${forwardHost}`;
      }
    }

    const absoluteUrl = `${publicUrlBase}/api/view-pdf/${fileName}`;
    res.json({ url: absoluteUrl });
  } catch (error: any) {
    console.error("Failed to save PDF:", error);
    res.status(500).json({ error: "Failed to save PDF", details: error.message });
  }
});

app.get("/api/view-pdf/:fileName", (req, res) => {
  const filePath = path.join(uploadsDir, req.params.fileName);
  if (fs.existsSync(filePath)) {
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=" + encodeURIComponent(req.params.fileName));
    res.sendFile(filePath);
  } else {
    res.status(404).send("PDF not found");
  }
});

// Send email with PDF attachment
app.post("/api/send-email", async (req, res) => {
  const { to, subject, body, pdfBase64, fileName } = req.body;
  if (!to || !pdfBase64 || !fileName) {
    return res.status(400).json({ error: "Missing required fields: to, pdfBase64, fileName" });
  }

  try {
    const base64Data = pdfBase64.includes(",") ? pdfBase64.split(",")[1] : pdfBase64;
    const pdfBuffer = Buffer.from(base64Data, "base64");

    const brevoApiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.BREVO_SENDER_EMAIL || process.env.SMTP_USER;

    if (!brevoApiKey || !senderEmail) {
      console.warn("Brevo API credentials not configured. Please define BREVO_API_KEY and BREVO_SENDER_EMAIL in .env.");
      return res.json({
        success: true,
        smtpConfigured: false,
        message: `Certificate compiled! Email simulated successfully to ${to} (to send real emails, please configure BREVO_API_KEY and BREVO_SENDER_EMAIL in your environment secrets).`
      });
    }

    const payload = {
      sender: { email: senderEmail, name: "Verified Academy" },
      to: [{ email: to }],
      subject: subject || "Your Digital Certificate of Completion",
      htmlContent: body ? body.replace(/\n/g, "<br>") : `Dear Student,<br><br>Please find attached your digital Certificate of Completion.<br><br>Best regards,<br>Academy Team`,
      attachment: [
        {
          name: fileName,
          content: base64Data
        }
      ]
    };

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": brevoApiKey,
        "content-type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const responseData = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(responseData.message || JSON.stringify(responseData) || "Brevo API rejected the request");
    }

    res.json({ success: true, smtpConfigured: true, message: `Email successfully sent to ${to} with certificate attached!` });
  } catch (error: any) {
    console.error("Email API error:", error);
    res.status(500).json({ error: "Failed to send email", details: error.message });
  }
});

// API: User Profile and Sync
app.get("/api/user/profile", async (req, res) => {
  const userId = await getUserIdFromRequest(req);
  if (!userId) {
    return res.status(401).json({ error: "Authentication token invalid or missing." });
  }

  let userObj = users.find(u => u.id === userId);
  
  // If user does not exist in local file db, load from Clerk or create
  if (!userObj) {
    try {
      const clerkUser = await clerk.users.getUser(userId);
      const email = clerkUser.emailAddresses[0]?.emailAddress || "";
      const username = clerkUser.username || email.split("@")[0] || "user";
      const name = clerkUser.fullName || clerkUser.firstName || username;
      const role = (email === "warlockadam234@gmail.com" || email === "admincanvas123@gmail.com" || username.toLowerCase().startsWith("admin")) ? "admin" : "user";
      
      userObj = {
        id: userId,
        username,
        name,
        role,
        isPro: role === "admin" ? true : false
      };
      
      users.push(userObj);
      saveData(USERS_FILE, users);
    } catch (err) {
      userObj = {
        id: userId,
        username: "user_" + userId.slice(-6),
        name: "User",
        role: "user",
        isPro: false
      };
      users.push(userObj);
      saveData(USERS_FILE, users);
    }
  }

  res.json(userObj);
});

// API: Razorpay Payments Order Creation
app.post("/api/payments/order", async (req, res) => {
  const userId = await getUserIdFromRequest(req);
  if (!userId) {
    return res.status(401).json({ error: "Authentication token invalid or missing." });
  }

  const amount = 49900; // ₹499 in paise (Standard Pro subscription price)

  try {
    const key_id = process.env.RAZORPAY_KEY_ID || "rzp_test_TBqanYzYBoLC48";
    const key_secret = process.env.RAZORPAY_KEY_SECRET || "WlVFMzbyqxNSZyxcnhrCA19D";

    const razorpay = new Razorpay({
      key_id,
      key_secret
    });

    const options = {
      amount,
      currency: "INR",
      receipt: `receipt_pro_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: key_id
    });
  } catch (err: any) {
    console.error("Razorpay order creation failed:", err);
    res.status(500).json({ error: "Failed to initiate transaction", details: err.message });
  }
});

// API: Razorpay Signature Verification and User Pro Upgrade
app.post("/api/payments/verify", async (req, res) => {
  const userId = await getUserIdFromRequest(req);
  if (!userId) {
    return res.status(401).json({ error: "Authentication token invalid or missing." });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: "Missing required payment verification details." });
  }

  try {
    const secret = process.env.RAZORPAY_KEY_SECRET || "WlVFMzbyqxNSZyxcnhrCA19D";
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature === razorpay_signature) {
      // Signature matches! Upgrade user to PRO
      let userObj = users.find(u => u.id === userId);
      if (!userObj) {
        try {
          const clerkUser = await clerk.users.getUser(userId);
          const email = clerkUser.emailAddresses[0]?.emailAddress || "";
          const username = clerkUser.username || email.split("@")[0] || "user";
          const name = clerkUser.fullName || clerkUser.firstName || username;
          userObj = { id: userId, username, name, role: "user", isPro: true };
          users.push(userObj);
        } catch (err) {
          userObj = { id: userId, username: "user_" + userId.slice(-6), name: "User", role: "user", isPro: true };
          users.push(userObj);
        }
      } else {
        userObj.isPro = true;
      }

      saveData(USERS_FILE, users);
      res.json({ success: true, message: "Signature verified! Your account is upgraded to PRO status.", user: userObj });
    } else {
      res.status(400).json({ error: "Razorpay signature verification failed. Tampering detected." });
    }
  } catch (err: any) {
    console.error("Signature verification error:", err);
    res.status(500).json({ error: "Failed to verify transaction.", details: err.message });
  }
});

// Vite Middleware for Full-stack Integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

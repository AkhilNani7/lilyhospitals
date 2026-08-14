import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Database
const db = new Database("hospital.db");

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS inquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE TABLE IF NOT EXISTS testimonials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    author TEXT NOT NULL,
    rating INTEGER DEFAULT 5,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed initial testimonials if empty
const testimonialCount = db.prepare("SELECT count(*) as count FROM testimonials").get() as { count: number };
if (testimonialCount.count === 0) {
  const insertTestimonial = db.prepare("INSERT INTO testimonials (text, author, rating) VALUES (?, ?, ?)");
  insertTestimonial.run("Experienced doctor, good service. The diagnosis was very accurate and the treatment plan was clear.", "Local Resident", 5);
  insertTestimonial.run("Perfect treatment... supported even during night time. Truly a dependable local hospital.", "Patient Family", 5);
  insertTestimonial.run("Empathetic staff and a very clean environment. Dr. Christal Doss is very communicative.", "Verified Patient", 5);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/testimonials", (req, res) => {
    try {
      const testimonials = db.prepare("SELECT * FROM testimonials ORDER BY created_at DESC").all();
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch testimonials" });
    }
  });

  app.post("/api/inquiries", (req, res) => {
    const { name, phone, message } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ error: "Name and phone are required" });
    }

    try {
      const stmt = db.prepare("INSERT INTO inquiries (name, phone, message) VALUES (?, ?, ?)");
      const result = stmt.run(name, phone, message);
      res.status(201).json({ id: result.lastInsertRowid, status: "success" });
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ error: "Failed to save inquiry" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

console.log("API KEY:", process.env.GROQ_API_KEY ? "Loaded ✅" : "Missing ❌");

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

app.post("/review", async (req, res) => {
  try {
    console.log("Incoming request:", req.body);

    const { code } = req.body;

    if (!code || code.trim() === "") {
      return res.json({ result: "No code provided ❌" });
    }

    const completion = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: `Review this code:\n${code}`,
        },
      ],
    });

    console.log("Groq response:", completion);

    if (!completion || !completion.choices) {
      return res.json({ result: "Invalid AI response ❌" });
    }

    res.json({
      result: completion.choices[0]?.message?.content || "No output",
    });

  } catch (err) {
    console.log("🔥 FULL ERROR:", err);
    console.log("🔥 STACK:", err.stack);

    res.status(500).json({
      result: "Backend error: " + err.message,
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
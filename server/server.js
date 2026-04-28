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
    const { code } = req.body;

    if (!code) {
      return res.json({ result: "No code provided ❌" });
    }

    const completion = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: "You are a senior software engineer who reviews code.",
        },
        {
          role: "user",
          content: `Review this code and provide:
1. Bugs
2. Improvements
3. Fixed Code

Code:
${code}`,
        },
      ],
    });

    res.json({
      result: completion.choices[0].message.content,
    });

  } catch (err) {
    console.log("🔥 ERROR:", err);
    res.status(500).json({
      result: err.message,
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
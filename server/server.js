import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

app.get("/", (req, res) => {
  res.send("AI Code Reviewer API Running 🚀");
});

app.post("/review", async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.json({ result: "No code provided ❌" });
  }

  try {
    const completion = await client.chat.completions.create({
      model: "llama-3.1-8b-instant", 
      messages: [
        {
          role: "system",
          content:
            "You are a senior software engineer who reviews code professionally.",
        },
        {
          role: "user",
          content: `Review this code and provide:
1. Bugs
2. Improvements
3. Optimized version

Code:
${code}`,
        },
      ],
      temperature: 0.7,
    });

    res.json({
      result: completion.choices[0].message.content,
    });

  } catch (err) {
    console.log("🔥 GROQ ERROR:", err);

    res.status(500).json({
      result: "Error: " + err.message,
    });
  }
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

console.log("API KEY:", process.env.GROQ_API_KEY ? "Loaded ✅" : "Missing ❌");
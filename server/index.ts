import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5174",           // local dev
    "https://docsense.vercel.app",     // production — update with real URL
  ]
}));
app.use(express.json({ limit: "10mb" }));

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

app.get("/", (_, res) => {
  res.json({
    status: "Backend running",
  });
});

app.post("/api/ai", async (req, res) => {
  try {
    const { messages, systemPrompt } = req.body;

    const completion = await client.chat.completions.create({
      model: "meta-llama/llama-3.3-70b-instruct",
      messages: [
        {
          role: "system",
          content:
            systemPrompt ??
            "You are a helpful document assistant.",
        },
        ...messages,
      ],
      temperature: 0.7,
    });

    const content =
      completion.choices[0]?.message?.content ?? "";

    res.json({ content });

  } catch (err: any) {
    console.error(err);

    res.status(500).json({
      error: err.message,
    });

  }
});

const PORT = process.env.PORT ?? 3001;

app.listen(PORT, () => {
  console.log(
    `✅ Backend running at http://localhost:${PORT}`
  );
});
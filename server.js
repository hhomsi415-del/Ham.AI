require("dotenv").config();

const express = require("express");
const path = require("path");
const OpenAI = require("openai");

const app = express();
const PORT = 3000;

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.use(express.json());
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/generate", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({
        message: "كتب فكرة التطبيق."
      });
    }

    const response = await client.responses.create({
      model: "gpt-5.6-luna",
      input: `You are a professional AI App Builder.

CREATE the application described by the user.

Do NOT repeat the user's request.
Do NOT summarize it.
Do NOT explain what you could build.

Return ONLY a complete working HTML document.

The HTML must include:
- HTML structure
- CSS styling
- JavaScript functionality
- Modern responsive design
- Working buttons
- Sample data if necessary

The generated HTML must be ready to open directly in a browser.

USER REQUEST:
${prompt}`
    });

    res.json({
      message: response.output_text
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "وقع مشكل مع AI."
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server khdam f http://localhost:${PORT}`);
});
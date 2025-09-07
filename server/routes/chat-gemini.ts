import type { RequestHandler } from "express";

export const handleGeminiChat: RequestHandler = async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      res.status(500).json({ error: "Missing GEMINI_API_KEY" });
      return;
    }

    const { prompt, history } = req.body || {};
    if (typeof prompt !== "string" || !prompt.trim()) {
      res.status(400).json({ error: "Invalid prompt" });
      return;
    }

    const contents: any[] = [];
    if (Array.isArray(history)) {
      for (const m of history) {
        if (!m || typeof m.content !== "string") continue;
        const role = m.role === "model" ? "model" : "user";
        contents.push({ role, parts: [{ text: m.content }] });
      }
    }
    contents.push({ role: "user", parts: [{ text: prompt }] });

    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents })
      }
    );

    if (!resp.ok) {
      const text = await resp.text();
      res.status(502).json({ error: "Upstream error", detail: text });
      return;
    }

    const data = await resp.json();
    const text = data?.candidates?.[0]?.content?.parts?.map((p: any) => p?.text).join("\n") || "";
    res.json({ text });
  } catch (err: any) {
    res.status(500).json({ error: "Server error", detail: err?.message || String(err) });
  }
};

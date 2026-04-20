export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { topic, count } = req.body;
  if (!topic || !count) return res.status(400).json({ error: "missing params" });

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 250,
        messages: [{
          role: "user",
          content: `"${topic}"와 연상되는 단어 ${count}개를 쉼표로만 구분해서 답해. 설명 없이 단어만. 각 단어 2~6글자.`
        }]
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(200).json({ words: [], debug: data.error });
    }

    const raw = data.content?.map(b => b.text || "").join("") || "";
    const words = raw
      .split(/[,，、\n]/)
      .map(w => w.trim().replace(/^\d+\.\s*/, "").trim())
      .filter(w => w.length > 0 && w.length <= 10)
      .slice(0, count);

    res.status(200).json({ words, debug: raw });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

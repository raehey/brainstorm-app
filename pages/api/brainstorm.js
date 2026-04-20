export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { topic, count, path, mode } = req.body;
  if (!topic) return res.status(400).json({ error: "missing params" });

  try {
    // AI 최종 제안 모드
    if (mode === "suggest") {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 600,
          messages: [{
            role: "user",
            content: `사용자가 브레인스토밍을 통해 다음 경로로 생각을 이어왔어: ${path.join(" → ")}

이 흐름을 바탕으로 아래 3가지를 한국어로 따뜻하고 구체적으로 제안해줘. 반드시 JSON 형식으로만 답해. 다른 말은 하지마.

{
  "action": "지금 당장 할 수 있는 구체적인 행동 한 가지 (2~3문장)",
  "mood": "어떤 기분이나 마음가짐으로 있으면 좋을지 (2~3문장)",
  "tip": "이 흐름에서 AI가 발견한 인사이트 한마디 (2~3문장)"
}`
          }]
        })
      });
      const data = await response.json();
      const raw = data.content?.map(b => b.text || "").join("") || "{}";
      try {
        const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
        return res.status(200).json(parsed);
      } catch {
        return res.status(200).json({ action: "잠시 휴식을 취해보세요.", mood: "편안한 마음으로 있어보세요.", tip: "당신의 흐름은 의미있어요." });
      }
    }

    // 연상 단어 생성 모드
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
    if (data.error) return res.status(200).json({ words: [], debug: data.error });

    const raw = data.content?.map(b => b.text || "").join("") || "";
    const words = raw
      .split(/[,，、\n]/)
      .map(w => w.trim().replace(/^\d+\.\s*/, "").trim())
      .filter(w => w.length > 0 && w.length <= 10)
      .slice(0, count);

    res.status(200).json({ words });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

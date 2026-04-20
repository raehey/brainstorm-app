export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { topic, count, path, mode, persona } = req.body;
  if (!topic) return res.status(400).json({ error: "missing params" });

  const PERSONA_PROMPTS = {
    friend:      "친한 친구처럼 편하고 따뜻하게, 반말로",
    coach:       "열정적인 코치처럼 동기부여하며 직접적으로",
    poet:        "감성적인 시인처럼 아름답고 시적으로",
    philosopher: "깊은 철학자처럼 통찰력 있고 사려 깊게",
  };
  const personaPrompt = PERSONA_PROMPTS[persona] || PERSONA_PROMPTS.friend;

  const INVEST_KEYWORDS = ["주식","투자","종목","ETF","코스피","나스닥","배당","펀드","채권","부동산","코인","비트코인","금","달러","환율","증시","포트폴리오","수익","재테크","자산"];
  const isInvest = path && path.some(w => INVEST_KEYWORDS.some(k => w.includes(k)));

  try {
    if (mode === "suggest") {
      const investSection = isInvest ? `
"invest": {
  "theme": "이 탐색 흐름과 어울리는 투자 테마 2~3가지 (예: AI반도체, 2차전지, 헬스케어 등)",
  "stocks": "테마와 관련된 국내외 종목명 3~5개를 나열 (예: 삼성전자, NVIDIA, TSMC 등). 단순 정보 제공이며 투자 권유가 아님을 명시",
  "etf": "관련 ETF 1~2개 (예: KODEX 반도체, QQQ 등)",
  "mindset": "이 투자 흐름에서 가져야 할 마음가짐 1~2문장",
  "disclaimer": "⚠️ 이 정보는 AI가 생성한 참고용 정보이며, 투자 권유가 아닙니다. 최종 투자 결정과 책임은 본인에게 있습니다."
}` : `"invest": null`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `사용자가 브레인스토밍을 통해 다음 경로로 생각을 이어왔어: ${path.join(" → ")}

이 흐름을 바탕으로 ${personaPrompt} 스타일로 아래 항목들을 한국어로 작성해줘.
반드시 JSON 형식으로만 답해. 다른 말은 절대 하지마.

{
  "action": "지금 당장 할 수 있는 구체적인 행동 한 가지 (2~3문장)",
  "mood": "어떤 기분이나 마음가짐으로 있으면 좋을지 (2~3문장)",
  "job": "이 흐름과 어울리는 직업 또는 역할 3가지와 이유 (2~3문장)",
  "todo": "오늘 당장 실천할 수 있는 할 일 3가지 (번호 매겨서)",
  "tip": "이 탐색 흐름에서 발견한 핵심 인사이트 한마디 (1~2문장)",
  ${investSection}
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
        return res.status(200).json({
          action: "지금 이 순간, 딱 한 가지만 시작해보세요.",
          mood: "편안하고 열린 마음으로 있어보세요.",
          job: "당신의 흐름과 잘 맞는 창의적인 역할들이 많아요.",
          todo: "① 오늘 느낀 것 적기\n② 관련 자료 찾아보기\n③ 한 가지 실천하기",
          tip: "이 탐색의 흐름 속에 당신이 원하는 것이 담겨 있어요.",
          invest: null,
        });
      }
    }

    // 연상 단어 생성
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

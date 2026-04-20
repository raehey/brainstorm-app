export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { topic, count, path, mode, persona, exclude, message, history, fw } = req.body;

  const PERSONA_PROMPTS = {
    friend:"친한 친구처럼 편하고 따뜻하게 반말로",
    coach:"열정적인 코치처럼 직접적으로",
    poet:"감성적인 시인처럼 시적으로",
    philosopher:"깊은 철학자처럼 통찰력 있게",
  };
  const pp = PERSONA_PROMPTS[persona] || PERSONA_PROMPTS.friend;
  const INVEST_KW = ["주식","투자","종목","ETF","코스피","나스닥","배당","펀드","채권","코인","재테크","자산"];
  const isInvest = path && path.some(w => INVEST_KW.some(k => w.includes(k)));

  async function ai(content, max=300){
    const r = await fetch("https://api.anthropic.com/v1/messages",{
      method:"POST", headers:{"Content-Type":"application/json","x-api-key":process.env.ANTHROPIC_API_KEY,"anthropic-version":"2023-06-01"},
      body:JSON.stringify({model:"claude-haiku-4-5-20251001",max_tokens:max,messages:[{role:"user",content}]})
    });
    const d = await r.json();
    return d.content?.map(b=>b.text||"").join("")||"";
  }

  try {
    // ── 채팅 모드
    if(mode==="chat"){
      const r = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST", headers:{"Content-Type":"application/json","x-api-key":process.env.ANTHROPIC_API_KEY,"anthropic-version":"2023-06-01"},
        body:JSON.stringify({model:"claude-haiku-4-5-20251001",max_tokens:250,
          system:`사용자가 "${(path||[]).join("→")}" 탐색해서 "${fw}"에 도달했어. ${pp} 스타일로 짧게 대화해.`,
          messages:[...(history||[]).map(m=>({role:m.role,content:m.content||m.text})),{role:"user",content:message}]})
      });
      const d = await r.json();
      return res.json({reply:d.content?.map(b=>b.text||"").join("")||"다시 물어봐!"});
    }

    // ── 힌트 모드
    if(mode==="hint"){
      const hint = await ai(`브레인스토밍 경로: "${(path||[]).join("→")}". 이 흐름을 보고 한 줄 코멘트 20자 이내로.`, 80);
      return res.json({hint});
    }

    // ── 결과 제안 모드
    if(mode==="suggest"){
      const investSection = isInvest ? `"invest":{"theme":"투자 테마 2~3가지","stocks":"관련 종목 3~5개 (참고용)","etf":"관련 ETF 1~2개","mindset":"투자 마인드셋 1~2문장","disclaimer":"⚠️ 참고용 정보이며 투자 권유가 아닙니다. 최종 결정은 본인의 몫입니다."}` : `"invest":null`;

      const [main, ltr, emo] = await Promise.all([
        ai(`브레인스토밍 경로: "${path.join("→")}". ${pp} 스타일로 JSON만 답해:\n{"action":"할 행동 2문장","mood":"마음가짐 2문장","job":"추천 직업 3가지","todo":"① ② ③ 할 일","tip":"핵심 인사이트","story":"탐색 여정 이야기 3~4문장",${investSection}}`, 1200),
        ai(`"${path.join("→")}" 탐색한 사람에게 따뜻한 AI 편지 4~5문장.`, 300),
        ai(`"${path.join("→")}" 경로로 감정 분석. JSON만: {"emoji":"이모지1개","label":"감정 한 단어","desc":"2문장","color":"파스텔 헥스컬러"}`, 150),
      ]);

      try {
        const parsed = JSON.parse(main.replace(/```json|```/g,"").trim());
        let emotion = null;
        try { emotion = JSON.parse(emo.replace(/```json|```/g,"").trim()); } catch {}
        return res.json({...parsed, letter: ltr, emotion});
      } catch {
        return res.json({action:"한 가지부터 시작해봐!",mood:"편안하게 있어봐.",job:"창의적인 역할들이 잘 맞아.",todo:"① 기록하기\n② 찾아보기\n③ 실천하기",tip:"이 흐름 속에 답이 있어.",story:`${path[0]}에서 시작한 여정이 ${topic}에 닿았어.`,letter:ltr,emotion:null,invest:null});
      }
    }

    // ── 연상 단어 생성
    const excludeList = Array.isArray(exclude) ? exclude : [];
    const excludeText = excludeList.length > 0 ? ` 반드시 제외: ${excludeList.join(", ")}` : "";
    const raw = await ai(`"${topic}"와 연상되는 창의적이고 신선한 단어 ${count}개를 쉼표로만 구분해서 답해. 설명 없이 단어만. 각 단어 2~6글자.${excludeText}`, 250);
    const words = raw.split(/[,，、\n]/).map(w=>w.trim().replace(/^\d+\.\s*/,"").trim()).filter(w=>w.length>0&&w.length<=10&&!excludeList.includes(w)).slice(0,count);
    return res.json({words});

  } catch(e) {
    return res.status(500).json({error:e.message});
  }
}

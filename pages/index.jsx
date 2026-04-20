import { useState } from "react";

const COLORS = [
  { bg: "#F0EBFF", border: "#C4B5FD", text: "#5B21B6" },
  { bg: "#ECFDF5", border: "#6EE7B7", text: "#065F46" },
  { bg: "#FFF7ED", border: "#FCD34D", text: "#92400E" },
  { bg: "#FFF1F2", border: "#FDA4AF", text: "#9F1239" },
  { bg: "#EFF6FF", border: "#93C5FD", text: "#1E40AF" },
  { bg: "#F0FDF4", border: "#86EFAC", text: "#166534" },
  { bg: "#FFFBEB", border: "#FDE68A", text: "#78350F" },
  { bg: "#FDF4FF", border: "#E879F9", text: "#701A75" },
];

const MAX = 6;
const HINTS = ["커피", "여행", "창업", "독서", "건강", "음악"];
const countFor = s => s <= 2 ? 8 : s <= 4 ? 6 : 4;
const font = "'Apple SD Gothic Neo','Noto Sans KR',system-ui,sans-serif";

export default function App() {
  const [screen, setScreen] = useState("home"); // home | game | loading | result
  const [inp, setInp] = useState("");
  const [stageIdx, setStageIdx] = useState(0);
  const [words, setWords] = useState([]);
  const [selected, setSelected] = useState(null);
  const [path, setPath] = useState([]);
  const [finalWord, setFinalWord] = useState(null);
  const [ai, setAi] = useState(null);
  const [err, setErr] = useState("");

  const isFinal = stageIdx === MAX - 1;
  const visibleWords = words.slice(0, countFor(stageIdx + 1));

  async function fetchWords(topic) {
    const res = await fetch("/api/brainstorm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, count: countFor(1) })
    });
    const data = await res.json();
    return data.words || [];
  }

  async function start(topic) {
    if (!topic.trim()) return;
    setErr("");
    setScreen("loading");
    try {
      const ws = await fetchWords(topic);
      if (ws.length < 2) { setErr("다시 시도해주세요."); setScreen("home"); return; }
      setPath([topic]);
      setWords(ws);
      setStageIdx(0);
      setSelected(null);
      setScreen("game");
    } catch { setErr("오류가 발생했어요."); setScreen("home"); }
  }

  async function next() {
    if (selected === null) return;
    const word = visibleWords[selected];
    const newPath = [...path, word];
    setPath(newPath);
    setSelected(null);

    if (isFinal) {
      setFinalWord(word);
      setScreen("loading");
      try {
        const res = await fetch("/api/brainstorm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic: word, path: newPath, mode: "suggest" })
        });
        const data = await res.json();
        setAi(data);
        setScreen("result");
      } catch { setScreen("result"); }
    } else {
      setScreen("loading");
      try {
        const res = await fetch("/api/brainstorm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic: word, count: countFor(stageIdx + 2) })
        });
        const data = await res.json();
        if (data.words?.length >= 2) {
          setWords(data.words);
          setStageIdx(stageIdx + 1);
          setScreen("game");
        } else { setErr("다시 시도해주세요."); setScreen("game"); }
      } catch { setErr("오류가 발생했어요."); setScreen("game"); }
    }
  }

  function back() {
    if (stageIdx === 0) { setScreen("home"); return; }
    setPath(path.slice(0, -1));
    setStageIdx(stageIdx - 1);
    setSelected(null);
    setScreen("game");
  }

  function restart() {
    setScreen("home"); setInp(""); setPath([]); setWords([]);
    setStageIdx(0); setSelected(null); setAi(null); setFinalWord(null); setErr("");
  }

  // 로딩
  if (screen === "loading") return (
    <div style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#F8F7FF", fontFamily: font, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
      <div style={{ fontSize: 48 }}>🧠</div>
      <p style={{ fontSize: 16, fontWeight: 700, color: "#4C1D95", margin: 0 }}>
        {isFinal ? "AI가 분석 중이에요..." : "단어를 찾는 중..."}
      </p>
      <p style={{ fontSize: 13, color: "#A78BFA", margin: 0, textAlign: "center", padding: "0 40px", lineHeight: 1.6 }}>
        {isFinal ? "당신의 탐색 흐름을 보고\n딱 맞는 제안을 만들고 있어요" : "잠깐만요!"}
      </p>
    </div>
  );

  // 결과
  if (screen === "result") return (
    <div style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#F8F7FF", fontFamily: font, paddingBottom: 40 }}>
      <div style={{ padding: "24px 20px 20px", background: "#fff", borderBottom: "1px solid #EDE9FE" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
          <button onClick={restart} style={{ width: 34, height: 34, borderRadius: 10, background: "#EDE9FE", border: "none", cursor: "pointer", fontSize: 15, color: "#7C3AED" }}>←</button>
          <span style={{ fontSize: 12, color: "#A78BFA", fontWeight: 600 }}>브레인스토밍 완료</span>
        </div>
        <p style={{ fontSize: 11, color: "#C4B5FD", margin: "0 0 8px", fontWeight: 600, letterSpacing: "0.05em" }}>나의 탐색 경로</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 16 }}>
          {path.map((w, i) => (
            <span key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              {i > 0 && <span style={{ color: "#DDD6FE", fontSize: 12 }}>→</span>}
              <span style={{ fontSize: 13, fontWeight: 700, color: "#fff", background: COLORS[i % COLORS.length].border, padding: "4px 12px", borderRadius: 20 }}>{w}</span>
            </span>
          ))}
        </div>
        <div style={{ background: "#4C1D95", borderRadius: 20, padding: "16px 20px" }}>
          <p style={{ fontSize: 11, color: "#C4B5FD", margin: "0 0 4px", fontWeight: 600 }}>최종 키워드</p>
          <p style={{ fontSize: 28, fontWeight: 900, margin: 0, color: "#fff" }}>🎯 {finalWord}</p>
        </div>
      </div>

      <div style={{ padding: "20px" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#7C3AED", margin: "0 0 14px" }}>✨ AI가 당신의 흐름을 분석했어요</p>

        {[
          { icon: "🎬", title: "지금 이걸 해보세요", text: ai?.action, bg: "#fff", border: "#EDE9FE", color: "#374151", tcolor: "#4C1D95" },
          { icon: "🌿", title: "이런 기분으로 있어보세요", text: ai?.mood, bg: "#fff", border: "#EDE9FE", color: "#374151", tcolor: "#4C1D95" },
          { icon: "💜", title: "AI 한마디", text: ai?.tip, bg: "#F0EBFF", border: "#C4B5FD", color: "#5B21B6", tcolor: "#4C1D95" },
        ].map((card, i) => (
          <div key={i} style={{ background: card.bg, border: `1.5px solid ${card.border}`, borderRadius: 20, padding: "18px", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 20 }}>{card.icon}</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: card.tcolor }}>{card.title}</span>
            </div>
            <p style={{ fontSize: 14, color: card.color, margin: 0, lineHeight: 1.7 }}>{card.text || "..."}</p>
          </div>
        ))}

        <button onClick={restart} style={{ width: "100%", marginTop: 8, padding: "16px", borderRadius: 18, background: "#6D28D9", color: "#fff", border: "none", fontSize: 16, fontWeight: 800, cursor: "pointer", fontFamily: font }}>
          다시 탐색하기
        </button>
      </div>
    </div>
  );

  // 홈
  if (screen === "home") return (
    <div style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#F8F7FF", fontFamily: font, padding: "60px 20px 40px" }}>
      <h1 style={{ fontSize: 32, fontWeight: 900, color: "#4C1D95", margin: "0 0 8px" }}>🧠 브레인스토밍</h1>
      <p style={{ fontSize: 14, color: "#A78BFA", margin: "0 0 40px", lineHeight: 1.6 }}>단어를 타고 6단계를 거쳐<br/>AI의 맞춤 제안을 받아보세요</p>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input value={inp} onChange={e => setInp(e.target.value)}
          onKeyDown={e => e.key === "Enter" && start(inp)}
          placeholder="시작 단어를 입력하세요..."
          style={{ flex: 1, fontSize: 15, padding: "14px 16px", border: "1.5px solid #DDD6FE", borderRadius: 16, outline: "none", fontFamily: font, background: "#fff" }} />
        <button onClick={() => start(inp)} disabled={!inp.trim()}
          style={{ padding: "0 20px", fontWeight: 800, fontSize: 14, background: "#6D28D9", color: "#fff", border: "none", borderRadius: 16, cursor: "pointer", fontFamily: font }}>시작</button>
      </div>

      {err && <p style={{ color: "#EF4444", fontSize: 13, marginBottom: 12 }}>{err}</p>}

      <p style={{ fontSize: 12, color: "#C4B5FD", margin: "0 0 10px", fontWeight: 600 }}>추천 주제</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {HINTS.map((s, i) => (
          <button key={s} onClick={() => start(s)}
            style={{ fontSize: 14, padding: "8px 18px", borderRadius: 20, color: COLORS[i].text, background: COLORS[i].bg, border: `1.5px solid ${COLORS[i].border}`, cursor: "pointer", fontWeight: 700, fontFamily: font }}>
            {s}
          </button>
        ))}
      </div>
    </div>
  );

  // 게임
  return (
    <div style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#F8F7FF", fontFamily: font, paddingBottom: 100 }}>
      <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid #EDE9FE", background: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <button onClick={back} style={{ width: 34, height: 34, borderRadius: 10, background: "#EDE9FE", border: "none", cursor: "pointer", fontSize: 15, color: "#7C3AED" }}>←</button>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {Array.from({ length: MAX }, (_, i) => (
              <div key={i} style={{ width: i <= stageIdx ? 20 : 7, height: 7, borderRadius: 20, background: i < stageIdx ? "#C4B5FD" : i === stageIdx ? (isFinal ? "#F59E0B" : "#7C3AED") : "#EDE9FE", transition: "all 0.4s ease" }} />
            ))}
          </div>
          <div style={{ background: isFinal ? "#FEF3C7" : "#EDE9FE", borderRadius: 12, padding: "5px 12px", fontSize: 12, color: isFinal ? "#D97706" : "#7C3AED", fontWeight: 700 }}>
            {isFinal ? "마지막 🎯" : `${stageIdx + 1}/${MAX}`}
          </div>
        </div>

        {path.length > 1 && (
          <div style={{ marginBottom: 14 }}>
            <p style={{ fontSize: 11, color: "#C4B5FD", margin: "0 0 8px", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>탐색 경로</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {path.slice(0, -1).map((w, i) => (
                <span key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  {i > 0 && <span style={{ color: "#DDD6FE", fontSize: 12 }}>→</span>}
                  <span style={{ fontSize: 14, fontWeight: 800, color: "#fff", background: COLORS[i % COLORS.length].border, padding: "5px 14px", borderRadius: 20, boxShadow: `0 2px 8px ${COLORS[i % COLORS.length].border}66` }}>{w}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        <div>
          <p style={{ fontSize: 11, color: "#C4B5FD", margin: "0 0 4px", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>현재 주제</p>
          <h2 style={{ fontSize: 36, fontWeight: 900, margin: 0, color: "#4C1D95", letterSpacing: "-1px" }}>{path[path.length - 1]}</h2>
        </div>

        <div style={{ marginTop: 14, height: 5, background: "#EDE9FE", borderRadius: 20, overflow: "hidden" }}>
          <div style={{ width: `${((stageIdx + 1) / MAX) * 100}%`, height: "100%", background: isFinal ? "#F59E0B" : "#7C3AED", borderRadius: 20, transition: "width 0.5s ease" }} />
        </div>
      </div>

      <div style={{ padding: "16px 20px 12px" }}>
        <p style={{ fontSize: 13, color: isFinal ? "#D97706" : "#A78BFA", margin: 0, fontWeight: 600 }}>
          {isFinal ? "✨ 하나를 고르면 AI가 제안해드려요" : `${visibleWords.length}개 중 하나를 골라보세요 ↓`}
        </p>
      </div>

      {err && <p style={{ color: "#EF4444", fontSize: 13, padding: "0 20px" }}>{err}</p>}

      <div style={{ padding: "0 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {visibleWords.map((word, i) => {
          const c = COLORS[i % COLORS.length];
          const isSel = selected === i;
          return (
            <button key={i} onClick={() => setSelected(isSel ? null : i)}
              style={{
                background: isSel ? c.border : c.bg,
                border: `2px solid ${c.border}`,
                borderRadius: 20,
                padding: visibleWords.length <= 4 ? "24px 12px" : "18px 12px",
                cursor: "pointer", fontFamily: font,
                fontSize: visibleWords.length <= 4 ? 18 : 16,
                fontWeight: 700,
                color: isSel ? "#fff" : c.text,
                transition: "all 0.2s ease",
                transform: isSel ? "scale(0.97)" : "scale(1)",
                boxShadow: isSel ? `0 4px 16px ${c.border}88` : "none",
                textAlign: "center",
              }}>
              {word}
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 390, padding: "16px 20px", background: "#fff", borderTop: "1px solid #EDE9FE" }}>
          <button onClick={next} style={{ width: "100%", padding: "16px", borderRadius: 18, background: isFinal ? "#D97706" : "#6D28D9", color: "#fff", border: "none", fontSize: 16, fontWeight: 800, cursor: "pointer", fontFamily: font }}>
            {isFinal ? `"${visibleWords[selected]}" 선택 → AI 제안 받기 ✨` : `"${visibleWords[selected]}" 로 계속 탐색 →`}
          </button>
        </div>
      )}
    </div>
  );
}

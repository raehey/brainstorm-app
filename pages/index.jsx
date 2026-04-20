import { useState } from "react";

const MAX = 9;
const W = 660, H = 480, CX = 330, CY = 240;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const countFor = s => Math.max(2, 11 - s);

function geoFor(n) {
  if (n >= 10) return { r: 186, rx: 54, ry: 24 };
  if (n >= 8)  return { r: 173, rx: 62, ry: 28 };
  if (n >= 6)  return { r: 160, rx: 70, ry: 32 };
  if (n >= 4)  return { r: 148, rx: 78, ry: 36 };
  return             { r: 132, rx: 88, ry: 40 };
}

const PAL = [
  { f:"#EDE9FD", s:"#B8ADEE", t:"#4B3FAA" },
  { f:"#D9F4EB", s:"#5DCAA5", t:"#0D6647" },
  { f:"#FEF0D7", s:"#F5C36A", t:"#7A4D0A" },
  { f:"#FAE5E1", s:"#F0917A", t:"#8C2E1A" },
  { f:"#DFF0FC", s:"#78BAE8", t:"#14517A" },
  { f:"#FCE6F1", s:"#EA88B8", t:"#8C2250" },
  { f:"#E4F7DC", s:"#7DC96A", t:"#2D6B1E" },
  { f:"#FDF3DC", s:"#E8C96A", t:"#7A5A0A" },
  { f:"#F0EAF7", s:"#C9A8E8", t:"#5E2D8C" },
  { f:"#E8F7F9", s:"#7BCDD6", t:"#1A6B72" },
];

const HINTS = ["커피", "여행", "창업", "독서", "건강", "음악"];

function getPos(i, n, r) {
  const a = (i / n) * 2 * Math.PI - Math.PI / 2;
  return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) };
}

function wrap(txt, max = 7) {
  if (txt.length <= max) return [txt];
  const m = Math.ceil(txt.length / 2);
  const sp = txt.indexOf(" ", m - 2);
  const c = sp > 0 ? sp : m;
  return [txt.slice(0, c).trim(), txt.slice(c).trim()];
}

const font = "'Apple SD Gothic Neo', 'Pretendard', 'Noto Sans KR', system-ui, sans-serif";

export default function App() {
  const [inp, setInp] = useState("");
  const [stage, setStage] = useState(0);
  const [center, setCenter] = useState(null);
  const [words, setWords] = useState([]);
  const [hist, setHist] = useState([]);
  const [phase, setPhase] = useState("idle");
  const [err, setErr] = useState("");
  const [done, setDone] = useState(null);

  async function go(topic, toStage) {
    if (phase !== "idle") return;
    setErr("");
    if (toStage > MAX) {
      if (center) setHist(h => [...h, { center, words, stage }]);
      setDone(topic);
      return;
    }
    if (center) { setPhase("fadeout"); await sleep(300); }
    setPhase("loading");
    try {
      const res = await fetch("/api/brainstorm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, count: countFor(toStage) })
      });
      const data = await res.json();
      if (data.words?.length >= 2) {
        if (center) setHist(h => [...h, { center, words, stage }]);
        setCenter(topic); setWords(data.words); setStage(toStage); setInp("");
        setPhase("entering"); await sleep(30); setPhase("idle");
      } else { setErr("다시 시도해주세요."); setPhase("idle"); }
    } catch { setErr("오류가 발생했어요."); setPhase("idle"); }
  }

  function back() {
    if (!hist.length) return;
    const p = hist[hist.length - 1];
    setHist(h => h.slice(0, -1));
    setCenter(p.center); setWords(p.words); setStage(p.stage); setDone(null);
  }

  function restart() {
    setCenter(null); setWords([]); setHist([]); setStage(0); setInp(""); setDone(null); setPhase("idle");
  }

  const ns = stage + 1;
  const isFinal = stage === MAX;
  const geo = geoFor(words.length);
  const mapVisible = phase === "idle";
  const showMap = center && phase !== "loading";
  const path = [...hist.map(h => h.center), center].filter(Boolean);

  if (done) return (
    <div style={{ maxWidth: 520, margin: "3rem auto", padding: "2rem 1.5rem", textAlign: "center", fontFamily: font }}>
      <div style={{ fontSize: 52, marginBottom: 16 }}>🎯</div>
      <p style={{ fontSize: 12, color: "#bbb", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>브레인스토밍 결론</p>
      <div style={{ background: "#EDE9FD", border: "2.5px solid #B8ADEE", borderRadius: 32, padding: "1.25rem 2.5rem", display: "inline-block", marginBottom: 24 }}>
        <span style={{ fontSize: 32, fontWeight: 800, color: "#4B3FAA" }}>{done}</span>
      </div>
      <div style={{ display: "flex", gap: 5, justifyContent: "center", flexWrap: "wrap", marginBottom: 28 }}>
        {path.map((w, i) => (
          <span key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            {i > 0 && <span style={{ color: "#ddd", fontSize: 11 }}>→</span>}
            <span style={{ background: PAL[i % PAL.length].f, color: PAL[i % PAL.length].t, padding: "3px 11px", borderRadius: 20, fontSize: 12, fontWeight: 500 }}>{w}</span>
          </span>
        ))}
        <span style={{ color: "#ddd", fontSize: 11 }}>→</span>
        <span style={{ background: "#4B3FAA", color: "#fff", padding: "3px 13px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>🎯 {done}</span>
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        <button onClick={restart} style={{ padding: "11px 28px", borderRadius: 14, background: "#5B50D6", color: "#fff", border: "none", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>처음부터 다시</button>
        <button onClick={back} style={{ padding: "11px 20px", borderRadius: 14, background: "#f5f5f5", color: "#666", border: "1px solid #e8e8e8", fontSize: 14, cursor: "pointer" }}>다시 선택하기</button>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "1.5rem 1rem", fontFamily: font }}>
      <h2 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 3px", color: "#1a1a1a" }}>🧠 브레인스토밍</h2>
      <p style={{ fontSize: 13, color: "#bbb", marginTop: 0, marginBottom: 18 }}>단어를 타고 9단계를 거쳐 최종 결론에 도달해보세요</p>

      {stage > 0 && (
        <div style={{ marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 8 }}>
            {Array.from({ length: MAX }, (_, i) => (
              <div key={i} style={{ height: 7, borderRadius: 20, flexShrink: 0, transition: "all 0.45s ease", width: i < stage ? 20 : 7, background: i < stage ? (isFinal ? "#E8C96A" : "#5B50D6") : "#ebebeb" }} />
            ))}
            <span style={{ fontSize: 11, color: "#ccc", marginLeft: 6 }}>{stage}/{MAX}</span>
          </div>
          <p style={{ fontSize: 12, margin: 0, fontWeight: isFinal ? 700 : 400, color: isFinal ? "#854F0B" : "#ccc" }}>
            {isFinal ? "🎯 마지막! 하나를 골라 결론을 내보세요" : `다음 단계: ${countFor(ns)}개 단어로 좁혀져요`}
          </p>
        </div>
      )}

      {path.length > 1 && (
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 14, flexWrap: "wrap" }}>
          {path.map((w, i) => (
            <span key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {i > 0 && <span style={{ color: "#e8e8e8", fontSize: 10 }}>→</span>}
              <span style={{ fontSize: 12, fontWeight: i === path.length - 1 ? 700 : 400, color: i === path.length - 1 ? "#4B3FAA" : "#ccc" }}>{w}</span>
            </span>
          ))}
          <button onClick={back} style={{ marginLeft: 6, fontSize: 11, padding: "2px 9px", borderRadius: 20, color: "#999", background: "#f7f7f7", border: "0.5px solid #e5e5e5", cursor: "pointer" }}>← 뒤로</button>
          <button onClick={restart} style={{ fontSize: 11, padding: "2px 9px", borderRadius: 20, color: "#999", background: "#f7f7f7", border: "0.5px solid #e5e5e5", cursor: "pointer" }}>처음</button>
        </div>
      )}

      {stage === 0 && (
        <>
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            <input value={inp} onChange={e => setInp(e.target.value)}
              onKeyDown={e => e.key === "Enter" && phase === "idle" && go(inp, 1)}
              placeholder="시작 단어를 입력하세요 (예: 커피, 여행...)"
              style={{ flex: 1, fontSize: 15, padding: "10px 15px", border: "1.5px solid #e8e8e8", borderRadius: 14, outline: "none", fontFamily: font }} />
            <button onClick={() => go(inp, 1)} disabled={phase !== "idle" || !inp.trim()}
              style={{ padding: "0 22px", fontWeight: 700, fontSize: 14, background: "#5B50D6", color: "#fff", border: "none", borderRadius: 14, cursor: "pointer" }}>시작</button>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
            {HINTS.map(s => (
              <button key={s} onClick={() => go(s, 1)} style={{ fontSize: 13, padding: "5px 15px", borderRadius: 20, color: "#666", background: "#f7f7f7", border: "1px solid #eee", cursor: "pointer" }}>{s}</button>
            ))}
          </div>
        </>
      )}

      {err && <p style={{ color: "#e05", fontSize: 13 }}>{err}</p>}

      <div style={{ background: isFinal ? "#FFFDF5" : "#fafafa", borderRadius: 22, overflow: "hidden", border: `1px solid ${isFinal ? "#F5C36A" : "#f0f0f0"}`, minHeight: phase === "loading" ? 320 : 0, transition: "border-color 0.4s, background 0.4s", position: "relative" }}>
        {phase === "loading" && (
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>💭</div>
            <p style={{ fontSize: 14, color: "#ccc", margin: 0 }}>연상 단어를 생각하는 중...</p>
          </div>
        )}
        {showMap && (
          <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", display: "block", opacity: mapVisible ? 1 : 0, transform: mapVisible ? "scale(1)" : "scale(0.96)", transition: "opacity 0.32s ease, transform 0.32s ease" }}>
            {words.map((_, i) => {
              const p = getPos(i, words.length, geo.r);
              const c = PAL[i % PAL.length];
              return <line key={i} x1={CX} y1={CY} x2={p.x} y2={p.y} stroke={c.s} strokeWidth={isFinal ? 2 : 1.5} strokeDasharray={isFinal ? "none" : "5,4"} opacity={0.55} />;
            })}
            <circle cx={CX} cy={CY} r={55} fill="#fff" stroke={isFinal ? "#F5C36A" : "#C8C4E8"} strokeWidth={2.5} />
            <circle cx={CX} cy={CY} r={63} fill="none" stroke={isFinal ? "#FEF0D7" : "#EDE9FD"} strokeWidth={1.5} />
            {wrap(center, 6).map((ln, li, arr) => (
              <text key={li} x={CX} y={CY + (li - (arr.length - 1) / 2) * 19} textAnchor="middle" dominantBaseline="middle" fontSize={15} fontWeight="800" fill={isFinal ? "#7A4D0A" : "#3D2F9E"}>{ln}</text>
            ))}
            {words.map((w, i) => {
              const p = getPos(i, words.length, geo.r);
              const c = PAL[i % PAL.length];
              const ls = wrap(w, 7);
              const ex = isFinal ? 9 : 0;
              return (
                <g key={i} style={{ cursor: "pointer" }} onClick={() => go(w, ns)}>
                  {isFinal && <ellipse cx={p.x} cy={p.y} rx={geo.rx + 18} ry={geo.ry + 12} fill="none" stroke={c.s} strokeWidth={1} opacity={0.28} strokeDasharray="4,3" />}
                  <ellipse cx={p.x} cy={p.y} rx={geo.rx + ex} ry={geo.ry + ex * 0.5} fill={c.f} stroke={c.s} strokeWidth={isFinal ? 2 : 1.5} />
                  {ls.map((ln, li) => (
                    <text key={li} x={p.x} y={p.y + (li - (ls.length - 1) / 2) * 17} textAnchor="middle" dominantBaseline="middle" fontSize={isFinal ? 14 : 12} fontWeight={isFinal ? "800" : "600"} fill={c.t}>{ln}</text>
                  ))}
                  {isFinal && <text x={p.x} y={p.y + geo.ry + ex * 0.5 + 14} textAnchor="middle" fontSize={9} fill={c.s} fontWeight="700">▶ 결론으로</text>}
                </g>
              );
            })}
          </svg>
        )}
      </div>

      {showMap && mapVisible && (
        <p style={{ textAlign: "center", fontSize: 12, color: "#ccc", marginTop: 10 }}>
          {isFinal ? "🎯 클릭하면 이 단어가 최종 결론이 돼요" : `버블 클릭 → ${countFor(ns)}개 단어로 좁혀져요  (${ns}/${MAX} 단계)`}
        </p>
      )}
    </div>
  );
}

import { useState, useRef, useEffect } from "react";

const THEMES = {
  purple:{ name:"보라",emoji:"💜",primary:"#6D28D9",light:"#EDE9FE",border:"#C4B5FD",soft:"#F8F7FF",text:"#4C1D95",sub:"#A78BFA",dim:"#DDD6FE",
    bg:"linear-gradient(160deg,#1E0A3C,#2D1464,#4C1D95)", hbg:"linear-gradient(180deg,#2D1464,#4C1D95,#6D28D9)" },
  blue:  { name:"파랑",emoji:"💙",primary:"#1D4ED8",light:"#EFF6FF",border:"#93C5FD",soft:"#F0F9FF",text:"#1E3A8A",sub:"#60A5FA",dim:"#BFDBFE",
    bg:"linear-gradient(160deg,#0A1628,#1E3A8A,#1D4ED8)", hbg:"linear-gradient(180deg,#1E3A8A,#1D4ED8,#2563EB)" },
  green: { name:"초록",emoji:"💚",primary:"#15803D",light:"#ECFDF5",border:"#6EE7B7",soft:"#F0FDF4",text:"#14532D",sub:"#4ADE80",dim:"#BBF7D0",
    bg:"linear-gradient(160deg,#0A2818,#14532D,#15803D)", hbg:"linear-gradient(180deg,#14532D,#15803D,#16A34A)" },
  pink:  { name:"핑크",emoji:"🩷",primary:"#BE185D",light:"#FDF2F8",border:"#F9A8D4",soft:"#FFF5F9",text:"#831843",sub:"#F472B6",dim:"#FBCFE8",
    bg:"linear-gradient(160deg,#2D0A1E,#831843,#BE185D)", hbg:"linear-gradient(180deg,#831843,#BE185D,#DB2777)" },
};
const PERSONAS = {
  friend:     { name:"친구처럼",emoji:"🤝",desc:"편하고 따뜻하게" },
  coach:      { name:"코치처럼",emoji:"💪",desc:"동기부여하고 직접적으로" },
  poet:       { name:"시인처럼",emoji:"🌸",desc:"감성적이고 시적으로" },
  philosopher:{ name:"철학자처럼",emoji:"🧐",desc:"깊고 통찰력 있게" },
};
const BC = [
  {bg:"#F0EBFF",border:"#C4B5FD",text:"#5B21B6",glow:"rgba(196,181,253,0.5)"},
  {bg:"#ECFDF5",border:"#6EE7B7",text:"#065F46",glow:"rgba(110,231,183,0.5)"},
  {bg:"#FFF7ED",border:"#FCD34D",text:"#92400E",glow:"rgba(252,211,77,0.5)"},
  {bg:"#FFF1F2",border:"#FDA4AF",text:"#9F1239",glow:"rgba(253,164,175,0.5)"},
  {bg:"#EFF6FF",border:"#93C5FD",text:"#1E40AF",glow:"rgba(147,197,253,0.5)"},
  {bg:"#F0FDF4",border:"#86EFAC",text:"#166534",glow:"rgba(134,239,172,0.5)"},
  {bg:"#FFFBEB",border:"#FDE68A",text:"#78350F",glow:"rgba(253,230,138,0.5)"},
  {bg:"#FDF4FF",border:"#E879F9",text:"#701A75",glow:"rgba(232,121,249,0.5)"},
];
const CATEGORIES = [
  {label:"진로/직업",emoji:"🎯",words:["직업","꿈","성장","미래","재능"]},
  {label:"감정/마음",emoji:"💭",words:["감정","행복","불안","설렘","위로"]},
  {label:"창업/아이디어",emoji:"💡",words:["창업","아이디어","혁신","브랜드","고객"]},
  {label:"자기계발",emoji:"🌱",words:["습관","독서","운동","목표","루틴"]},
  {label:"관계/사람",emoji:"🤝",words:["친구","가족","사랑","소통","신뢰"]},
  {label:"돈/재테크",emoji:"💰",words:["주식","투자","절약","수익","부자"]},
];
const DAILY_WORDS=["커피","여행","음악","꿈","바람","빛","구름","별","파도","숲","시간","기억","설렘","미소","용기"];
const getDailyWord=()=>DAILY_WORDS[Math.floor(Date.now()/86400000)%DAILY_WORDS.length];
const MAX=6, countFor=s=>s<=2?8:s<=4?6:4;
const font="'Pretendard','Apple SD Gothic Neo',system-ui,sans-serif";

const CSS=`
  @keyframes bnc{0%,80%,100%{transform:scale(0.8);opacity:0.3}40%{transform:scale(1.4);opacity:1}}
  @keyframes slideRight{from{opacity:0;transform:translateX(50px)}to{opacity:1;transform:translateX(0)}}
  @keyframes slideLeft{from{opacity:0;transform:translateX(-50px)}to{opacity:1;transform:translateX(0)}}
  @keyframes slideUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
  @keyframes scaleIn{from{opacity:0;transform:scale(0.9)}to{opacity:1;transform:scale(1)}}
  @keyframes orbitSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  @keyframes orbitSpinRev{from{transform:rotate(0deg)}to{transform:rotate(-360deg)}}
  @keyframes brainPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}
  @keyframes particleFly{0%{transform:translate(0,0);opacity:1}100%{transform:translate(var(--tx),var(--ty));opacity:0}}
  @keyframes glowPulse{0%,100%{box-shadow:0 0 20px rgba(167,139,250,0.4)}50%{box-shadow:0 0 50px rgba(167,139,250,0.8)}}
  .card-scroll{opacity:0;transform:translateY(24px);transition:opacity 0.5s ease,transform 0.5s ease}
  .card-scroll.visible{opacity:1;transform:translateY(0)}
`;

function Page({children,dir="right",style={}}){
  const [v,setV]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setV(true),20);return()=>clearTimeout(t);},[]);
  const anim=dir==="up"?"slideUp":dir==="left"?"slideLeft":"slideRight";
  return <div style={{animation:v?`${anim} 0.35s cubic-bezier(.22,1,.36,1) both`:"none",minHeight:"100dvh",...style}}>{children}</div>;
}

function ScrollCard({children,delay=0}){
  const ref=useRef(null);
  useEffect(()=>{
    const el=ref.current; if(!el)return;
    const obs=new IntersectionObserver(es=>{if(es[0].isIntersecting){el.classList.add('visible');obs.disconnect();}},{threshold:0.1});
    obs.observe(el); return()=>obs.disconnect();
  },[]);
  return <div ref={ref} className="card-scroll" style={{transitionDelay:`${delay}ms`}}>{children}</div>;
}

function Particles({active}){
  if(!active)return null;
  return (
    <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:9999}}>
      {Array.from({length:16},(_,i)=>{
        const a=(i/16)*360, d=80+Math.random()*80;
        return <div key={i} style={{position:"absolute",left:"50%",top:"60%",width:8,height:8,borderRadius:"50%",background:"#C4B5FD","--tx":`${Math.cos(a*Math.PI/180)*d}px`,"--ty":`${Math.sin(a*Math.PI/180)*d-60}px`,animation:`particleFly 0.8s ${i*30}ms ease-out both`}}/>;
      })}
    </div>
  );
}

// ── 🆕 예쁜 로딩 애니메이션 ──────────────────────────────
function LoadingScreen({themeKey}){
  const t=THEMES[themeKey||"purple"];
  const [dot,setDot]=useState(0);
  useEffect(()=>{const id=setInterval(()=>setDot(d=>(d+1)%4),400);return()=>clearInterval(id);},[]);
  const dots="".padEnd(dot,"·");

  return (
    <div style={{maxWidth:390,margin:"0 auto",minHeight:"100dvh",background:t.bg,fontFamily:font,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:32,position:"relative",overflow:"hidden"}}>
      <style>{CSS}</style>

      {/* 배경 빛 */}
      <div style={{position:"absolute",width:400,height:400,borderRadius:"50%",background:`radial-gradient(circle,${t.border}22 0%,transparent 70%)`,animation:"brainPulse 2s ease-in-out infinite"}}/>

      {/* 궤도 애니메이션 */}
      <div style={{position:"relative",width:140,height:140,display:"flex",alignItems:"center",justifyContent:"center"}}>

        {/* 외부 궤도 */}
        <div style={{position:"absolute",width:140,height:140,borderRadius:"50%",border:`1.5px solid ${t.border}33`,animation:"orbitSpin 3s linear infinite"}}>
          {[0,120,240].map(deg=>(
            <div key={deg} style={{position:"absolute",width:10,height:10,borderRadius:"50%",background:t.border,top:"50%",left:"50%",transform:`rotate(${deg}deg) translateX(65px) translateY(-50%)`,boxShadow:`0 0 8px ${t.border}`}}/>
          ))}
        </div>

        {/* 내부 궤도 */}
        <div style={{position:"absolute",width:100,height:100,borderRadius:"50%",border:`1.5px solid ${t.border}22`,animation:"orbitSpinRev 2s linear infinite"}}>
          {[0,180].map(deg=>(
            <div key={deg} style={{position:"absolute",width:7,height:7,borderRadius:"50%",background:t.sub,top:"50%",left:"50%",transform:`rotate(${deg}deg) translateX(45px) translateY(-50%)`,boxShadow:`0 0 6px ${t.sub}`}}/>
          ))}
        </div>

        {/* 중앙 뇌 */}
        <div style={{width:64,height:64,borderRadius:"50%",background:`linear-gradient(135deg,${t.light},#fff)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,animation:"brainPulse 1.5s ease-in-out infinite",boxShadow:`0 0 24px ${t.border}88`,zIndex:2}}>
          🧠
        </div>
      </div>

      {/* 텍스트 */}
      <div style={{textAlign:"center"}}>
        <p style={{fontSize:20,fontWeight:800,color:"#fff",margin:"0 0 8px",letterSpacing:"-0.5px"}}>
          AI가 생각 중{dots}<span style={{opacity:0}}>{("·".repeat(3)).slice(dot)}</span>
        </p>
        <p style={{fontSize:13,color:"rgba(255,255,255,0.5)",margin:0}}>잠시만 기다려주세요</p>
      </div>

      {/* 점 애니메이션 */}
      <div style={{display:"flex",gap:8}}>
        {[0,1,2,3].map(i=>(
          <div key={i} style={{width:8,height:8,borderRadius:"50%",background:i<dot?t.border:"rgba(255,255,255,0.2)",transition:"background 0.2s",boxShadow:i<dot?`0 0 8px ${t.border}`:"none"}}/>
        ))}
      </div>
    </div>
  );
}

// ── 버블 ──────────────────────────────────────────────────
function Bubble({word,color,size,selected,onClick}){
  const [popped,setPopped]=useState(false);
  const fs=size==="lg"?16:size==="md"?14:12;
  const py=size==="lg"?18:size==="md"?14:11;
  const lines=word.length>7?[word.slice(0,Math.ceil(word.length/2)),word.slice(Math.ceil(word.length/2))]:[word];
  function handle(){
    if(!selected){setPopped(true);setTimeout(()=>setPopped(false),400);}
    onClick();
  }
  return (
    <button onClick={handle} style={{
      width:"100%",padding:`${py}px 8px`,
      background:selected?`linear-gradient(135deg,${color.border},${color.border}cc)`:color.bg,
      border:`2px solid ${color.border}`,borderRadius:9999,cursor:"pointer",fontFamily:font,
      fontSize:fs,fontWeight:700,color:selected?"#fff":color.text,
      transition:"all 0.18s cubic-bezier(.34,1.56,.64,1)",
      transform:selected?"scale(0.94)":popped?"scale(1.08)":"scale(1)",
      boxShadow:selected?`0 4px 16px ${color.glow},0 0 0 3px ${color.border}33`:`0 2px 6px ${color.glow}33`,
      textAlign:"center",lineHeight:1.4,
    }}>
      {lines.map((ln,i)=><span key={i} style={{display:"block"}}>{ln}</span>)}
    </button>
  );
}

// ── 설정 화면 ─────────────────────────────────────────────
function SettingsScreen({themeKey,setThemeKey,persona,setPersona,onBack}){
  const t=THEMES[themeKey];
  return (
    <Page dir="right" style={{background:t.soft,fontFamily:font,paddingBottom:40}}>
      <style>{CSS}</style>
      <div style={{background:t.hbg,padding:"24px 20px 20px",borderRadius:"0 0 28px 28px",marginBottom:20}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <button onClick={onBack} style={{width:36,height:36,borderRadius:12,background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.2)",cursor:"pointer",fontSize:16,color:"#fff"}}>←</button>
          <h2 style={{fontSize:20,fontWeight:900,color:"#fff",margin:0}}>설정</h2>
        </div>
      </div>
      <div style={{padding:"0 20px"}}>
        <p style={{fontSize:12,color:t.sub,fontWeight:700,margin:"0 0 12px",letterSpacing:"0.05em"}}>테마 색상</p>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:28}}>
          {Object.entries(THEMES).map(([k,th])=>(
            <button key={k} onClick={()=>setThemeKey(k)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,padding:"12px 18px",borderRadius:16,background:k===themeKey?"#fff":t.light,border:`2px solid ${k===themeKey?th.primary:t.border}`,cursor:"pointer",fontFamily:font,transition:"all 0.2s"}}>
              <span style={{fontSize:22}}>{th.emoji}</span>
              <span style={{fontSize:12,fontWeight:700,color:k===themeKey?th.primary:t.sub}}>{th.name}</span>
            </button>
          ))}
        </div>
        <p style={{fontSize:12,color:t.sub,fontWeight:700,margin:"0 0 12px",letterSpacing:"0.05em"}}>AI 페르소나</p>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {Object.entries(PERSONAS).map(([k,p])=>(
            <button key={k} onClick={()=>setPersona(k)} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 16px",borderRadius:16,background:k===persona?"#fff":t.light,border:`2px solid ${k===persona?t.primary:t.border}`,cursor:"pointer",fontFamily:font,textAlign:"left",transition:"all 0.2s"}}>
              <span style={{fontSize:24}}>{p.emoji}</span>
              <div>
                <p style={{fontSize:14,fontWeight:800,color:k===persona?t.text:"#6B7280",margin:0}}>{p.name}</p>
                <p style={{fontSize:12,color:t.sub,margin:0}}>{p.desc}</p>
              </div>
              {k===persona&&<span style={{marginLeft:"auto",color:t.primary,fontSize:18}}>✓</span>}
            </button>
          ))}
        </div>
      </div>
    </Page>
  );
}

// ── 결과 카드 ─────────────────────────────────────────────
function ResultCard({icon,title,text,gradient,delay=0}){
  if(!text)return null;
  return (
    <ScrollCard delay={delay}>
      <div style={{background:gradient||"#1F2937",borderRadius:24,padding:"16px 18px",marginBottom:10,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-16,right:-16,width:60,height:60,borderRadius:"50%",background:"rgba(255,255,255,0.06)"}}/>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
          <div style={{width:32,height:32,borderRadius:10,background:"rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{icon}</div>
          <span style={{fontSize:13,fontWeight:800,color:"rgba(255,255,255,0.9)"}}>{title}</span>
        </div>
        <p style={{fontSize:13,margin:0,lineHeight:1.7,whiteSpace:"pre-line",color:"rgba(255,255,255,0.8)"}}>{text}</p>
      </div>
    </ScrollCard>
  );
}

function AiChat({path,fw}){
  const [msgs,setMsgs]=useState([{role:"assistant",text:`"${fw}" 탐색에 대해 궁금한 게 있으면 물어보세요 😊`}]);
  const [inp,setInp]=useState(""); const [loading,setLoading]=useState(false);
  const bottomRef=useRef(null);
  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"});},[msgs]);
  async function send(){
    if(!inp.trim()||loading)return;
    const msg=inp.trim(); setInp("");
    setMsgs(m=>[...m,{role:"user",text:msg}]); setLoading(true);
    try {
      const res=await fetch("/api/brainstorm",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({mode:"chat",path,fw,message:msg,history:msgs.slice(1).map(m=>({role:m.role,content:m.text}))})});
      const d=await res.json();
      setMsgs(m=>[...m,{role:"assistant",text:d.reply||"다시 물어봐!"}]);
    } catch { setMsgs(m=>[...m,{role:"assistant",text:"오류! 다시 시도해줘."}]); }
    setLoading(false);
  }
  return (
    <ScrollCard delay={420}>
      <div style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:20,overflow:"hidden",marginBottom:10}}>
        <div style={{background:"rgba(139,92,246,0.2)",padding:"10px 14px",display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:15}}>💬</span>
          <span style={{fontSize:13,fontWeight:800,color:"rgba(255,255,255,0.9)"}}>AI와 대화하기</span>
        </div>
        <div style={{padding:"10px",maxHeight:200,overflowY:"auto"}}>
          {msgs.map((m,i)=>(
            <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",marginBottom:6}}>
              <div style={{maxWidth:"80%",padding:"8px 12px",borderRadius:m.role==="user"?"16px 16px 4px 16px":"16px 16px 16px 4px",background:m.role==="user"?"linear-gradient(135deg,#7C3AED,#6D28D9)":"rgba(255,255,255,0.08)",color:"rgba(255,255,255,0.9)",fontSize:13,lineHeight:1.5,fontFamily:font}}>{m.text}</div>
            </div>
          ))}
          {loading&&<div style={{display:"flex",gap:4,padding:"4px 12px"}}>{[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:"50%",background:"rgba(196,181,253,0.6)",animation:`bnc 1s ${i*0.15}s infinite`}}/>)}</div>}
          <div ref={bottomRef}/>
        </div>
        <div style={{borderTop:"1px solid rgba(255,255,255,0.08)",padding:"8px 10px",display:"flex",gap:8}}>
          <input value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}
            placeholder="궁금한 것을 물어보세요..."
            style={{flex:1,minWidth:0,fontSize:13,padding:"8px 12px",border:"1px solid rgba(255,255,255,0.15)",borderRadius:10,outline:"none",fontFamily:font,background:"rgba(255,255,255,0.06)",color:"#fff"}}/>
          <button onClick={send} disabled={!inp.trim()||loading}
            style={{padding:"8px 12px",borderRadius:10,background:"linear-gradient(135deg,#7C3AED,#6D28D9)",color:"#fff",border:"none",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:font,flexShrink:0}}>전송</button>
        </div>
      </div>
    </ScrollCard>
  );
}

// ── 메인 ──────────────────────────────────────────────────
export default function App(){
  const [themeKey,setThemeKey]=useState("purple");
  const [persona,setPersona]=useState("friend");
  const [screen,setScreen]=useState("home");
  const [inp,setInp]=useState("");
  const [si,setSi]=useState(0);
  const [words,setWords]=useState([]);
  const [sel,setSel]=useState(null);
  const [path,setPath]=useState([]);
  const [fw,setFw]=useState(null);
  const [ai,setAi]=useState(null);
  const [err,setErr]=useState("");
  const [hint,setHint]=useState(null);
  const [selCat,setSelCat]=useState(null);
  const [letter,setLetter]=useState(null);
  const [emotion,setEmotion]=useState(null);
  const [particles,setParticles]=useState(false);
  const [copied,setCopied]=useState(false);

  const t=THEMES[themeKey];
  const isFinal=si===MAX-1;
  const vw=words.slice(0,countFor(si+1));
  const bsz=vw.length<=4?"lg":vw.length<=6?"md":"sm";
  const dailyWord=getDailyWord();

  async function fetchWords(topic,count,exclude){
    const res=await fetch("/api/brainstorm",{method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({topic,count,exclude:exclude||[]})});
    const d=await res.json(); return d.words||[];
  }

  async function startGame(topic){
    if(!topic.trim())return;
    setErr(""); setScreen("loading");
    try {
      const ws=await fetchWords(topic,countFor(1),[]);
      if(ws.length<2){setErr("다시 시도해주세요.");setScreen("home");return;}
      setPath([topic]); setWords(ws); setSi(0); setSel(null); setHint(null); setLetter(null); setEmotion(null);
      setScreen("game");
    } catch { setErr("오류가 발생했어요."); setScreen("home"); }
  }

  async function next(){
    if(sel===null)return;
    const word=vw[sel]; const np=[...path,word];
    setPath(np); setSel(null); setHint(null);
    if(isFinal){
      setFw(word); setScreen("loading");
      setParticles(true); setTimeout(()=>setParticles(false),1000);
      try {
        const res=await fetch("/api/brainstorm",{method:"POST",headers:{"Content-Type":"application/json"},
          body:JSON.stringify({topic:word,path:np,mode:"suggest",persona})});
        const d=await res.json();
        setAi(d); setLetter(d.letter||null); setEmotion(d.emotion||null);
      } catch {
        setAi({action:"한 가지부터!",mood:"편안하게.",job:"창의적인 역할이 맞아.",todo:"① 기록 ② 탐색 ③ 실천",tip:"이 흐름에 답이 있어.",story:`${np[0]}에서 시작한 여정이 ${word}에 닿았어.`});
      }
      setScreen("result"); return;
    }
    const nextSi=si+1; const needed=countFor(nextSi+1);
    setScreen("loading");
    try {
      let ws=await fetchWords(word,needed+3,np);
      ws=ws.filter(w=>!np.includes(w)).slice(0,needed);
      if(ws.length<2) ws=await fetchWords(word,needed,[]);
      if(ws.length>=2){ setWords(ws); setSi(nextSi); setScreen("game");
        if(nextSi===2) fetch("/api/brainstorm",{method:"POST",headers:{"Content-Type":"application/json"},
          body:JSON.stringify({mode:"hint",path:np})}).then(r=>r.json()).then(d=>{if(d.hint)setHint(d.hint);}).catch(()=>{});
      } else { setErr("단어를 불러오지 못했어요."); setPath(path); setScreen("game"); }
    } catch { setErr("오류가 발생했어요."); setPath(path); setScreen("game"); }
  }

  function restart(){ setScreen("home"); setInp(""); setPath([]); setWords([]); setSi(0); setSel(null); setAi(null); setFw(null); setErr(""); setHint(null); setSelCat(null); setLetter(null); setEmotion(null); }
  function shareLink(){ const url=`${window.location.origin}?path=${encodeURIComponent(path.join(","))}&fw=${encodeURIComponent(fw||"")}`; navigator.clipboard.writeText(url).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2500);}); }

  if(screen==="loading") return <LoadingScreen themeKey={themeKey}/>;
  if(screen==="settings") return <SettingsScreen themeKey={themeKey} setThemeKey={setThemeKey} persona={persona} setPersona={setPersona} onBack={()=>setScreen("home")}/>;

  // ── 결과 화면 ────────────────────────────────────────
  if(screen==="result") return (
    <Page dir="up" style={{background:"#0F0A1E",fontFamily:font}}>
      <style>{CSS}</style>
      <Particles active={particles}/>
      <div style={{background:"linear-gradient(180deg,#1E0A3C 0%,#2D1464 60%,transparent 100%)",padding:"28px 20px 36px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-60,left:"50%",transform:"translateX(-50%)",width:300,height:300,borderRadius:"50%",background:`radial-gradient(circle,${t.border}33 0%,transparent 70%)`}}/>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20,position:"relative"}}>
          <button onClick={restart} style={{width:36,height:36,borderRadius:12,background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.15)",cursor:"pointer",fontSize:16,color:"rgba(255,255,255,0.8)"}}>←</button>
          <span style={{fontSize:12,color:"rgba(255,255,255,0.6)",fontWeight:700}}>탐색 완료 🎉</span>
          <button onClick={shareLink} style={{padding:"6px 12px",borderRadius:12,background:copied?"rgba(110,231,183,0.2)":"rgba(255,255,255,0.1)",border:`1px solid ${copied?"rgba(110,231,183,0.5)":"rgba(255,255,255,0.15)"}`,color:copied?"#6EE7B7":"rgba(255,255,255,0.8)",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:font}}>
            {copied?"✓ 복사됨":"🔗 공유"}
          </button>
        </div>
        <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:16,position:"relative"}}>
          {path.map((w,i)=>(<span key={i} style={{display:"flex",alignItems:"center",gap:4}}>{i>0&&<span style={{color:"rgba(255,255,255,0.3)",fontSize:10}}>→</span>}<span style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.9)",background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.15)",padding:"3px 9px",borderRadius:20}}>{w}</span></span>))}
        </div>
        <div style={{background:`linear-gradient(135deg,rgba(139,92,246,0.3),rgba(109,40,217,0.5))`,border:`1px solid ${t.border}66`,borderRadius:22,padding:"18px 20px"}}>
          <p style={{fontSize:11,color:`${t.border}cc`,margin:"0 0 5px",fontWeight:700,letterSpacing:"0.08em"}}>최종 키워드</p>
          <p style={{fontSize:32,fontWeight:900,margin:0,color:"#fff",letterSpacing:"-1px"}}>🎯 {fw}</p>
        </div>
      </div>
      <div style={{padding:"0 20px 40px",background:"#0F0A1E"}}>
        {emotion&&(<ScrollCard delay={0}><div style={{background:`linear-gradient(135deg,${emotion.color||"#EDE9FE"},${emotion.color||"#EDE9FE"}88)`,borderRadius:22,padding:"16px 18px",marginBottom:10}}><div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}><div style={{width:32,height:32,borderRadius:10,background:"rgba(255,255,255,0.4)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>🎭</div><span style={{fontSize:13,fontWeight:800,color:"#1F2937"}}>감정 분석</span></div><div style={{display:"flex",alignItems:"center",gap:12}}><div style={{fontSize:40,lineHeight:1}}>{emotion.emoji}</div><div><p style={{fontSize:16,fontWeight:900,color:"#1F2937",margin:"0 0 3px"}}>{emotion.label}</p><p style={{fontSize:13,color:"#374151",margin:0,lineHeight:1.6}}>{emotion.desc}</p></div></div></div></ScrollCard>)}
        {ai?.story&&(<ScrollCard delay={60}><div style={{background:"linear-gradient(135deg,rgba(139,92,246,0.15),rgba(109,40,217,0.08))",border:`1px solid ${t.border}33`,borderRadius:22,padding:"16px 18px",marginBottom:10}}><div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}><div style={{width:32,height:32,borderRadius:10,background:`${t.border}33`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>📖</div><span style={{fontSize:13,fontWeight:800,color:"rgba(255,255,255,0.9)"}}>나의 탐색 이야기</span></div><p style={{fontSize:13,color:"rgba(255,255,255,0.75)",margin:0,lineHeight:1.8,fontStyle:"italic"}}>{ai.story}</p></div></ScrollCard>)}
        <ResultCard icon="🎬" title="지금 이걸 해보세요" text={ai?.action} gradient="linear-gradient(135deg,#1E3A5F,#1E40AF)" delay={120}/>
        <ResultCard icon="🌿" title="이런 기분으로 있어보세요" text={ai?.mood} gradient="linear-gradient(135deg,#064E3B,#065F46)" delay={180}/>
        <ResultCard icon="💼" title="추천 직업" text={ai?.job} gradient="linear-gradient(135deg,#3B1F6E,#4C1D95)" delay={240}/>
        <ResultCard icon="📋" title="오늘의 할 일" text={ai?.todo} gradient="linear-gradient(135deg,#7C2D12,#92400E)" delay={300}/>
        <ResultCard icon="💫" title="AI 한마디" text={ai?.tip} gradient="linear-gradient(135deg,#1F2937,#374151)" delay={360}/>
        {letter&&(<ScrollCard delay={420}><div style={{background:"linear-gradient(135deg,#4A0D6F,#701A75)",borderRadius:22,padding:"18px",marginBottom:10,border:"1px solid rgba(232,121,249,0.3)",position:"relative",overflow:"hidden"}}><div style={{position:"absolute",top:-24,right:-24,width:80,height:80,borderRadius:"50%",background:"rgba(232,121,249,0.1)"}}/>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}><div style={{width:32,height:32,borderRadius:10,background:"rgba(232,121,249,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>💌</div><span style={{fontSize:13,fontWeight:800,color:"rgba(255,255,255,0.9)"}}>AI가 쓴 편지</span></div>
          <p style={{fontSize:13,color:"rgba(255,255,255,0.8)",margin:0,lineHeight:1.8,fontStyle:"italic"}}>{letter}</p></div></ScrollCard>)}
        <AiChat path={path} fw={fw}/>
        <ScrollCard delay={500}>
          <button onClick={restart} style={{width:"100%",padding:"16px",borderRadius:20,background:`linear-gradient(135deg,${t.primary},${t.primary}cc)`,color:"#fff",border:"none",fontSize:16,fontWeight:800,cursor:"pointer",fontFamily:font,boxShadow:`0 8px 24px ${t.border}66`,marginTop:4}}>
            다시 탐색하기 ✨
          </button>
        </ScrollCard>
      </div>
    </Page>
  );

  // ── 게임 화면 (핵심 수정: 한 화면에 다 보이게) ────────
  if(screen==="game"){
    const cols=vw.length<=4?2:2;
    const rows=Math.ceil(vw.length/cols);
    return (
      <div style={{maxWidth:390,margin:"0 auto",height:"100dvh",display:"flex",flexDirection:"column",background:"#F8F7FF",fontFamily:font,overflow:"hidden"}}>
        <style>{CSS}</style>

        {/* 헤더 - 컴팩트 */}
        <div style={{background:t.hbg,padding:"16px 18px 20px",borderRadius:"0 0 24px 24px",boxShadow:`0 6px 24px ${t.border}44`,flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
            <button onClick={()=>{if(si===0)setScreen("home");else{setSi(si-1);setPath(path.slice(0,-1));setSel(null);setHint(null);}}}
              style={{width:34,height:34,borderRadius:11,background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.2)",cursor:"pointer",fontSize:14,color:"#fff"}}>←</button>
            <div style={{display:"flex",gap:4}}>
              {Array.from({length:MAX},(_,i)=>(<div key={i} style={{height:5,borderRadius:20,transition:"all 0.4s ease",width:i<=si?20:6,background:i<si?"rgba(255,255,255,0.45)":i===si?(isFinal?"#FCD34D":"#fff"):"rgba(255,255,255,0.18)"}}/>))}
            </div>
            <div style={{background:isFinal?"rgba(252,211,77,0.2)":"rgba(255,255,255,0.15)",border:`1px solid ${isFinal?"rgba(252,211,77,0.5)":"rgba(255,255,255,0.2)"}`,borderRadius:20,padding:"4px 12px",fontSize:11,color:isFinal?"#FCD34D":"rgba(255,255,255,0.9)",fontWeight:700}}>
              {isFinal?"마지막 🎯":`${si+1}/${MAX}`}
            </div>
          </div>
          {path.length>1&&(
            <div style={{display:"flex",flexWrap:"wrap",gap:3,marginBottom:8}}>
              {path.slice(0,-1).map((w,i)=>(<span key={i} style={{display:"flex",alignItems:"center",gap:3}}>{i>0&&<span style={{color:"rgba(255,255,255,0.3)",fontSize:10}}>→</span>}<span style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.9)",background:"rgba(255,255,255,0.12)",border:"1px solid rgba(255,255,255,0.18)",padding:"3px 9px",borderRadius:20}}>{w}</span></span>))}
            </div>
          )}
          <div>
            <p style={{fontSize:10,color:"rgba(255,255,255,0.45)",margin:"0 0 2px",fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase"}}>현재 주제</p>
            <h2 style={{fontSize:28,fontWeight:900,margin:0,color:"#fff",letterSpacing:"-1px"}}>{path[path.length-1]}</h2>
          </div>
        </div>

        {/* 중간 영역 - 힌트/안내 */}
        <div style={{padding:"10px 18px 6px",flexShrink:0}}>
          {hint&&(
            <div style={{background:`linear-gradient(135deg,${t.light},#fff)`,border:`1.5px solid ${t.border}`,borderRadius:14,padding:"8px 14px",marginBottom:8,display:"flex",alignItems:"center",gap:8,animation:"scaleIn 0.3s ease"}}>
              <span style={{fontSize:16,flexShrink:0}}>🤖</span>
              <p style={{fontSize:12,color:t.text,margin:0,fontWeight:600}}>{hint}</p>
            </div>
          )}
          {err&&<p style={{color:"#EF4444",fontSize:12,margin:"0 0 6px"}}>{err}</p>}
          <p style={{fontSize:12,color:isFinal?"#D97706":t.sub,margin:0,fontWeight:600}}>
            {isFinal?"✨ 하나를 고르면 AI가 분석해드려요":`${vw.length}개 중 하나를 골라보세요`}
          </p>
        </div>

        {/* 버블 그리드 - flex-grow로 남은 공간 채움 */}
        <div style={{flex:1,padding:"6px 18px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,alignContent:"center",minHeight:0}}>
          {vw.map((word,i)=>(
            <Bubble key={`${word}-${i}`} word={word} color={BC[i%BC.length]} size={bsz} selected={sel===i} onClick={()=>setSel(sel===i?null:i)}/>
          ))}
        </div>

        {/* 다음 버튼 - 항상 하단에 붙어있음 */}
        <div style={{padding:"10px 18px",paddingBottom:`max(10px, env(safe-area-inset-bottom))`,background:"rgba(248,247,255,0.97)",borderTop:`1px solid ${t.border}33`,flexShrink:0}}>
          {sel!==null ? (
            <button onClick={next} style={{width:"100%",padding:"15px",borderRadius:18,background:isFinal?`linear-gradient(135deg,#D97706,#B45309)`:`linear-gradient(135deg,${t.primary},${t.primary}cc)`,color:"#fff",border:"none",fontSize:15,fontWeight:800,cursor:"pointer",fontFamily:font,boxShadow:isFinal?"0 6px 20px rgba(217,119,6,0.4)":`0 6px 20px ${t.border}66`,transition:"all 0.2s"}}>
              {isFinal?`"${vw[sel]}" → AI 분석 받기 ✨`:`"${vw[sel]}" 로 계속 탐색 →`}
            </button>
          ) : (
            <div style={{width:"100%",padding:"15px",borderRadius:18,background:"rgba(0,0,0,0.05)",textAlign:"center",fontSize:13,color:"rgba(0,0,0,0.25)",fontWeight:600,fontFamily:font}}>
              단어를 선택해주세요
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── 홈 화면 ──────────────────────────────────────────
  return (
    <Page dir="left" style={{background:t.bg,fontFamily:font,minHeight:"100dvh",padding:"44px 20px 80px",position:"relative",overflow:"hidden"}}>
      <style>{CSS}</style>
      <div style={{position:"absolute",top:-100,right:-80,width:280,height:280,borderRadius:"50%",background:`radial-gradient(circle,${t.border}22 0%,transparent 70%)`,pointerEvents:"none"}}/>
      <div style={{position:"relative"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24}}>
          <h1 style={{fontSize:26,fontWeight:900,color:"#fff",margin:0}}>🧠 브레인스토밍</h1>
          {/* ✅ 설정 버튼 수정: onClick 제대로 연결 */}
          <button onClick={()=>setScreen("settings")} style={{width:40,height:40,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(255,255,255,0.12)",border:"1px solid rgba(255,255,255,0.18)",borderRadius:14,fontSize:18,cursor:"pointer",flexShrink:0}}>⚙️</button>
        </div>

        {/* 오늘의 단어 */}
        <div onClick={()=>startGame(dailyWord)} style={{background:"linear-gradient(135deg,rgba(139,92,246,0.4),rgba(109,40,217,0.6))",border:`1px solid ${t.border}44`,borderRadius:22,padding:"16px 20px",marginBottom:12,cursor:"pointer",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:-16,right:-16,width:80,height:80,borderRadius:"50%",background:"rgba(255,255,255,0.05)"}}/>
          <p style={{fontSize:11,color:`${t.border}cc`,margin:"0 0 5px",fontWeight:700,letterSpacing:"0.1em"}}>🎲 오늘의 단어</p>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <p style={{fontSize:28,fontWeight:900,color:"#fff",margin:0,letterSpacing:"-1px"}}>{dailyWord}</p>
            <span style={{fontSize:11,color:"rgba(255,255,255,0.8)",background:"rgba(255,255,255,0.12)",padding:"5px 12px",borderRadius:20,fontWeight:700,border:"1px solid rgba(255,255,255,0.15)"}}>탐색하기 →</span>
          </div>
        </div>

        {/* 하루 마무리 */}
        <div onClick={()=>startGame("오늘")} style={{background:"linear-gradient(135deg,rgba(15,23,42,0.8),rgba(30,58,138,0.5))",border:"1px solid rgba(147,197,253,0.15)",borderRadius:18,padding:"12px 16px",marginBottom:12,cursor:"pointer",display:"flex",alignItems:"center",gap:12}}>
          <span style={{fontSize:24}}>🌙</span>
          <div><p style={{fontSize:13,fontWeight:800,color:"#fff",margin:0}}>오늘 하루 마무리</p><p style={{fontSize:11,color:"rgba(255,255,255,0.45)",margin:0}}>오늘의 감정을 탐색으로 정리해요</p></div>
          <span style={{marginLeft:"auto",color:"rgba(255,255,255,0.25)",fontSize:16}}>→</span>
        </div>

        {/* 직접 입력 */}
        <div style={{background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:18,padding:"14px",marginBottom:14}}>
          <p style={{fontSize:11,color:"rgba(255,255,255,0.45)",margin:"0 0 8px",fontWeight:600}}>직접 입력</p>
          <div style={{display:"flex",gap:8}}>
            <input value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&inp.trim()&&startGame(inp)}
              placeholder="시작 단어를 입력하세요..."
              style={{flex:1,minWidth:0,fontSize:14,padding:"11px 14px",border:"1px solid rgba(255,255,255,0.15)",borderRadius:12,outline:"none",fontFamily:font,background:"rgba(255,255,255,0.08)",color:"#fff"}}/>
            <button onClick={()=>inp.trim()&&startGame(inp)} style={{flexShrink:0,padding:"11px 16px",fontWeight:800,fontSize:14,background:`linear-gradient(135deg,${t.primary},${t.primary}cc)`,color:"#fff",border:"none",borderRadius:12,cursor:"pointer",fontFamily:font,boxShadow:`0 4px 12px ${t.border}55`}}>시작</button>
          </div>
          {err&&<p style={{color:"#FDA4AF",fontSize:12,margin:"6px 0 0"}}>{err}</p>}
        </div>

        {/* 카테고리 */}
        <p style={{fontSize:11,color:"rgba(255,255,255,0.45)",margin:"0 0 8px",fontWeight:600}}>카테고리로 시작하기</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>
          {CATEGORIES.map((cat,i)=>(
            <button key={cat.label} onClick={()=>setSelCat(selCat===i?null:i)}
              style={{padding:"10px 12px",borderRadius:16,background:selCat===i?"rgba(139,92,246,0.4)":"rgba(255,255,255,0.06)",border:`1px solid ${selCat===i?`${t.border}88`:"rgba(255,255,255,0.09)"}`,cursor:"pointer",fontFamily:font,textAlign:"left",transition:"all 0.2s"}}>
              <span style={{fontSize:14,display:"block",marginBottom:2}}>{cat.emoji}</span>
              <span style={{fontSize:11,fontWeight:700,color:selCat===i?"#E9D5FF":"rgba(255,255,255,0.7)"}}>{cat.label}</span>
            </button>
          ))}
        </div>
        {selCat!==null&&(
          <div style={{marginTop:8,padding:"12px",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:16,animation:"scaleIn 0.3s ease"}}>
            <p style={{fontSize:11,color:`${t.border}cc`,margin:"0 0 7px",fontWeight:600}}>추천 시작 단어</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
              {CATEGORIES[selCat].words.map((w,i)=>(
                <button key={w} onClick={()=>startGame(w)}
                  style={{padding:"6px 13px",borderRadius:20,background:BC[i%BC.length].bg,border:`1.5px solid ${BC[i%BC.length].border}`,color:BC[i%BC.length].text,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:font}}>{w}</button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Page>
  );
}

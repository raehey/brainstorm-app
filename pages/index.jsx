import { useState, useRef, useEffect } from "react";

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
  @keyframes bnc{0%,80%,100%{transform:scale(0.8);opacity:0.4}40%{transform:scale(1.3);opacity:1}}
  @keyframes eyeBlink{0%,90%,100%{transform:scaleY(1)}95%{transform:scaleY(0.1)}}
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
  @keyframes slideRight{from{opacity:0;transform:translateX(60px)}to{opacity:1;transform:translateX(0)}}
  @keyframes slideLeft{from{opacity:0;transform:translateX(-60px)}to{opacity:1;transform:translateX(0)}}
  @keyframes slideUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
  @keyframes scaleIn{from{opacity:0;transform:scale(0.88)}to{opacity:1;transform:scale(1)}}
  @keyframes particleFly{0%{transform:translate(0,0) scale(1);opacity:1}100%{transform:translate(var(--tx),var(--ty)) scale(0);opacity:0}}
  @keyframes pulse{0%,100%{opacity:0.6;transform:scale(1)}50%{opacity:1;transform:scale(1.05)}}
  .card-scroll{opacity:0;transform:translateY(32px);transition:opacity 0.55s ease,transform 0.55s ease}
  .card-scroll.visible{opacity:1;transform:translateY(0)}
`;

function Page({children, dir="right", style={}}){
  const [visible,setVisible]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setVisible(true),20);return()=>clearTimeout(t);},[]);
  const anim=dir==="up"?"slideUp":dir==="left"?"slideLeft":"slideRight";
  return (
    <div style={{animation:visible?`${anim} 0.38s cubic-bezier(.22,1,.36,1) both`:"none",minHeight:"100vh",...style}}>
      {children}
    </div>
  );
}

function ScrollCard({children, delay=0, style={}}){
  const ref=useRef(null);
  useEffect(()=>{
    const el=ref.current; if(!el)return;
    const obs=new IntersectionObserver(entries=>{
      if(entries[0].isIntersecting){el.classList.add('visible');obs.disconnect();}
    },{threshold:0.1});
    obs.observe(el);
    return()=>obs.disconnect();
  },[]);
  return <div ref={ref} className="card-scroll" style={{transitionDelay:`${delay}ms`,...style}}>{children}</div>;
}

function Particles({active, color}){
  if(!active)return null;
  return (
    <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:9999}}>
      {Array.from({length:18},(_,i)=>{
        const angle=(i/18)*360;
        const dist=80+Math.random()*80;
        const tx=Math.cos(angle*Math.PI/180)*dist;
        const ty=Math.sin(angle*Math.PI/180)*dist-60;
        return <div key={i} style={{position:"absolute",left:"50%",top:"60%",width:8+Math.random()*8,height:8+Math.random()*8,borderRadius:"50%",background:color||"#C4B5FD","--tx":`${tx}px`,"--ty":`${ty}px`,animation:`particleFly 0.8s ${i*30}ms ease-out both`}}/>;
      })}
    </div>
  );
}

function Bubble({word,color,size,selected,onClick}){
  const [popped,setPopped]=useState(false);
  const fs=size==="lg"?17:size==="md"?15:13;
  const py=size==="lg"?24:size==="md"?19:15;
  const lines=word.length>7?[word.slice(0,Math.ceil(word.length/2)),word.slice(Math.ceil(word.length/2))]:[word];
  function handleClick(){
    if(!selected){setPopped(true);setTimeout(()=>setPopped(false),600);}
    onClick();
  }
  return (
    <button onClick={handleClick} style={{
      width:"100%",padding:`${py}px 12px`,
      background:selected?`linear-gradient(135deg,${color.border},${color.border}cc)`:color.bg,
      border:`2px solid ${color.border}`,borderRadius:9999,cursor:"pointer",fontFamily:font,
      fontSize:fs,fontWeight:700,color:selected?"#fff":color.text,
      transition:"all 0.2s cubic-bezier(.34,1.56,.64,1)",
      transform:selected?"scale(0.94)":popped?"scale(1.12)":"scale(1)",
      boxShadow:selected?`0 6px 24px ${color.glow},0 0 0 4px ${color.border}44`:popped?`0 0 0 8px ${color.glow}`:`0 2px 8px ${color.glow}44`,
      textAlign:"center",lineHeight:1.5,
    }}>
      {lines.map((ln,i)=><span key={i} style={{display:"block"}}>{ln}</span>)}
    </button>
  );
}

function LoadingScreen(){
  return (
    <div style={{maxWidth:390,margin:"0 auto",minHeight:"100vh",background:"linear-gradient(160deg,#1E0A3C,#4C1D95,#6D28D9)",fontFamily:font,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:28,position:"relative",overflow:"hidden"}}>
      <style>{CSS}</style>
      <div style={{position:"absolute",width:300,height:300,borderRadius:"50%",background:"radial-gradient(circle,rgba(196,181,253,0.15) 0%,transparent 70%)",top:"20%",left:"50%",transform:"translateX(-50%)",animation:"pulse 3s infinite"}}/>
      <div style={{position:"relative",animation:"float 2.2s ease-in-out infinite"}}>
        <div style={{position:"absolute",inset:-20,borderRadius:"50%",background:"radial-gradient(circle,rgba(196,181,253,0.3) 0%,transparent 70%)"}}/>
        <svg width="120" height="120" viewBox="0 0 110 110">
          <ellipse cx="55" cy="62" rx="36" ry="30" fill="rgba(196,181,253,0.2)"/>
          <ellipse cx="55" cy="60" rx="34" ry="28" fill="#EDE9FE" stroke="#C4B5FD" strokeWidth="2.5"/>
          <path d="M30 52 Q38 44 46 52 Q54 60 62 52 Q70 44 78 52" fill="none" stroke="#C4B5FD" strokeWidth="2" strokeLinecap="round"/>
          <path d="M34 62 Q42 56 50 62 Q58 68 66 62 Q72 56 78 62" fill="none" stroke="#C4B5FD" strokeWidth="2" strokeLinecap="round"/>
          <g style={{animation:"eyeBlink 3s infinite"}}>
            <ellipse cx="44" cy="57" rx="4" ry="4.5" fill="#4C1D95"/>
            <ellipse cx="66" cy="57" rx="4" ry="4.5" fill="#4C1D95"/>
          </g>
          <ellipse cx="44" cy="55.5" rx="1.5" ry="2" fill="white"/>
          <ellipse cx="66" cy="55.5" rx="1.5" ry="2" fill="white"/>
          <ellipse cx="36" cy="63" rx="5" ry="3" fill="#C4B5FD" opacity="0.6"/>
          <ellipse cx="74" cy="63" rx="5" ry="3" fill="#C4B5FD" opacity="0.6"/>
          <path d="M47 68 Q55 74 63 68" fill="none" stroke="#4C1D95" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
        <div style={{position:"absolute",top:-12,left:"50%",transform:"translateX(-50%)",background:"linear-gradient(135deg,#7C3AED,#6D28D9)",color:"#fff",borderRadius:20,padding:"4px 14px",fontSize:11,fontWeight:800,whiteSpace:"nowrap",boxShadow:"0 4px 12px rgba(109,40,217,0.5)"}}>생각 중... 🤔</div>
      </div>
      <div>
        <p style={{fontSize:18,fontWeight:800,color:"#fff",margin:"0 0 8px",textAlign:"center"}}>AI가 분석하고 있어요</p>
        <p style={{fontSize:13,color:"rgba(255,255,255,0.6)",margin:0,textAlign:"center"}}>잠시만 기다려주세요</p>
      </div>
      <div style={{display:"flex",gap:10}}>{[0,1,2].map(i=><div key={i} style={{width:10,height:10,borderRadius:"50%",background:"rgba(196,181,253,0.8)",animation:`bnc 1.3s ${i*0.22}s infinite`}}/>)}</div>
    </div>
  );
}

function ResultCard({icon,title,text,gradient,delay=0}){
  if(!text)return null;
  return (
    <ScrollCard delay={delay}>
      <div style={{background:gradient||"#1F2937",borderRadius:24,padding:"18px 20px",marginBottom:12,overflow:"hidden",position:"relative"}}>
        <div style={{position:"absolute",top:-20,right:-20,width:80,height:80,borderRadius:"50%",background:"rgba(255,255,255,0.06)"}}/>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
          <div style={{width:34,height:34,borderRadius:12,background:"rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{icon}</div>
          <span style={{fontSize:14,fontWeight:800,color:"rgba(255,255,255,0.9)"}}>{title}</span>
        </div>
        <p style={{fontSize:14,margin:0,lineHeight:1.75,whiteSpace:"pre-line",color:"rgba(255,255,255,0.8)"}}>{text}</p>
      </div>
    </ScrollCard>
  );
}

function AiChat({path,fw}){
  const [msgs,setMsgs]=useState([{role:"assistant",text:`"${fw}" 탐색 결과에 대해 궁금한 게 있으면 뭐든 물어보세요 😊`}]);
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
    <ScrollCard delay={480}>
      <div style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:24,overflow:"hidden",marginBottom:12}}>
        <div style={{background:"rgba(139,92,246,0.2)",padding:"12px 16px",display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:16}}>💬</span>
          <span style={{fontSize:13,fontWeight:800,color:"rgba(255,255,255,0.9)"}}>AI와 대화하기</span>
        </div>
        <div style={{padding:"12px",maxHeight:220,overflowY:"auto"}}>
          {msgs.map((m,i)=>(
            <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",marginBottom:8}}>
              <div style={{maxWidth:"80%",padding:"10px 14px",borderRadius:m.role==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px",background:m.role==="user"?"linear-gradient(135deg,#7C3AED,#6D28D9)":"rgba(255,255,255,0.08)",color:"rgba(255,255,255,0.9)",fontSize:13,lineHeight:1.6,fontFamily:font}}>{m.text}</div>
            </div>
          ))}
          {loading&&<div style={{display:"flex",gap:4,padding:"6px 14px"}}>{[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:"50%",background:"rgba(196,181,253,0.6)",animation:`bnc 1s ${i*0.15}s infinite`}}/>)}</div>}
          <div ref={bottomRef}/>
        </div>
        <div style={{borderTop:"1px solid rgba(255,255,255,0.08)",padding:"10px 12px",display:"flex",gap:8}}>
          <input value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}
            placeholder="궁금한 것을 물어보세요..."
            style={{flex:1,minWidth:0,fontSize:13,padding:"9px 14px",border:"1px solid rgba(255,255,255,0.15)",borderRadius:12,outline:"none",fontFamily:font,background:"rgba(255,255,255,0.06)",color:"#fff"}}/>
          <button onClick={send} disabled={!inp.trim()||loading}
            style={{padding:"9px 14px",borderRadius:12,background:"linear-gradient(135deg,#7C3AED,#6D28D9)",color:"#fff",border:"none",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:font,flexShrink:0}}>전송</button>
        </div>
      </div>
    </ScrollCard>
  );
}

export default function App(){
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
  const isFinal=si===MAX-1;
  const vw=words.slice(0,countFor(si+1));
  const bsz=vw.length<=4?"lg":vw.length<=6?"md":"sm";
  const dailyWord=getDailyWord();

  function goTo(s){setScreen(s);}

  async function fetchWords(topic,count,exclude=[]){
    const res=await fetch("/api/brainstorm",{method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({topic,count,exclude})});
    const d=await res.json();
    return d.words||[];
  }

  async function startGame(topic){
    if(!topic.trim())return;
    setErr(""); goTo("loading");
    try {
      const ws=await fetchWords(topic,countFor(1),[]);
      if(ws.length<2){setErr("다시 시도해주세요.");goTo("home");return;}
      setPath([topic]); setWords(ws); setSi(0); setSel(null); setHint(null); setLetter(null); setEmotion(null); goTo("game");
    } catch { setErr("오류가 발생했어요."); goTo("home"); }
  }

  function handleSel(i){ setSel(sel===i?null:i); }

  async function next(){
    if(sel===null)return;
    const word=vw[sel]; const np=[...path,word];
    setPath(np); setSel(null); setHint(null);
    if(isFinal){
      setFw(word); goTo("loading");
      setParticles(true); setTimeout(()=>setParticles(false),1000);
      try {
        const res=await fetch("/api/brainstorm",{method:"POST",headers:{"Content-Type":"application/json"},
          body:JSON.stringify({topic:word,path:np,mode:"suggest",persona:"friend"})});
        const d=await res.json();
        setAi(d); setLetter(d.letter||null); setEmotion(d.emotion||null);
      } catch { setAi({action:"한 가지부터!",mood:"편안하게.",job:"창의적인 역할이 맞아.",todo:"① 기록 ② 탐색 ③ 실천",tip:"이 흐름에 답이 있어.",story:`${np[0]}에서 시작한 여정이 ${word}에 닿았어.`}); }
      goTo("result");
    } else {
      goTo("loading");
      try {
        const ws=await fetchWords(word,countFor(si+2),np);
        if(ws.length>=2){
          setWords(ws); setSi(si+1); goTo("game");
          if(si+1===2){
            fetch("/api/brainstorm",{method:"POST",headers:{"Content-Type":"application/json"},
              body:JSON.stringify({mode:"hint",path:np})})
              .then(r=>r.json()).then(d=>setHint(d.hint||null)).catch(()=>{});
          }
        } else { setErr("다시 시도해주세요."); goTo("game"); }
      } catch { setErr("오류."); goTo("game"); }
    }
  }

  function restart(){ goTo("home"); setInp(""); setPath([]); setWords([]); setSi(0); setSel(null); setAi(null); setFw(null); setErr(""); setHint(null); setSelCat(null); setLetter(null); setEmotion(null); }
  function shareLink(){ const url=`${window.location.origin}?path=${encodeURIComponent(path.join(","))}&fw=${encodeURIComponent(fw||"")}`; navigator.clipboard.writeText(url).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2500);}); }

  if(screen==="loading") return <LoadingScreen/>;

  if(screen==="result") return (
    <Page dir="up" style={{background:"#0F0A1E",fontFamily:font}}>
      <style>{CSS}</style>
      <Particles active={particles} color="#C4B5FD"/>
      <div style={{background:"linear-gradient(180deg,#1E0A3C 0%,#2D1464 60%,transparent 100%)",padding:"32px 20px 40px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-60,left:"50%",transform:"translateX(-50%)",width:300,height:300,borderRadius:"50%",background:"radial-gradient(circle,rgba(139,92,246,0.3) 0%,transparent 70%)"}}/>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24,position:"relative"}}>
          <button onClick={restart} style={{width:36,height:36,borderRadius:12,background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.15)",cursor:"pointer",fontSize:16,color:"rgba(255,255,255,0.8)"}}>←</button>
          <span style={{fontSize:12,color:"rgba(255,255,255,0.6)",fontWeight:700}}>탐색 완료 🎉</span>
          <button onClick={shareLink} style={{padding:"7px 14px",borderRadius:12,background:copied?"rgba(110,231,183,0.2)":"rgba(255,255,255,0.1)",border:`1px solid ${copied?"rgba(110,231,183,0.5)":"rgba(255,255,255,0.15)"}`,color:copied?"#6EE7B7":"rgba(255,255,255,0.8)",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:font}}>
            {copied?"✓ 복사됨":"🔗 공유"}
          </button>
        </div>
        <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:20,position:"relative"}}>
          {path.map((w,i)=>(<span key={i} style={{display:"flex",alignItems:"center",gap:5}}>{i>0&&<span style={{color:"rgba(255,255,255,0.3)",fontSize:11}}>→</span>}<span style={{fontSize:12,fontWeight:700,color:"rgba(255,255,255,0.9)",background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.15)",padding:"3px 10px",borderRadius:20}}>{w}</span></span>))}
        </div>
        <div style={{background:"linear-gradient(135deg,rgba(139,92,246,0.3),rgba(109,40,217,0.5))",border:"1px solid rgba(196,181,253,0.4)",borderRadius:24,padding:"20px 22px",position:"relative"}}>
          <p style={{fontSize:11,color:"rgba(196,181,253,0.8)",margin:"0 0 6px",fontWeight:700,letterSpacing:"0.08em"}}>최종 키워드</p>
          <p style={{fontSize:34,fontWeight:900,margin:0,color:"#fff",letterSpacing:"-1px"}}>🎯 {fw}</p>
        </div>
      </div>
      <div style={{padding:"0 20px 40px",background:"#0F0A1E"}}>
        {emotion&&(
          <ScrollCard delay={0}>
            <div style={{background:`linear-gradient(135deg,${emotion.color||"#EDE9FE"},${emotion.color||"#EDE9FE"}88)`,borderRadius:24,padding:"18px 20px",marginBottom:12}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                <div style={{width:34,height:34,borderRadius:12,background:"rgba(255,255,255,0.4)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🎭</div>
                <span style={{fontSize:14,fontWeight:800,color:"#1F2937"}}>감정 분석</span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:14}}>
                <div style={{fontSize:44,lineHeight:1}}>{emotion.emoji}</div>
                <div><p style={{fontSize:17,fontWeight:900,color:"#1F2937",margin:"0 0 4px"}}>{emotion.label}</p><p style={{fontSize:13,color:"#374151",margin:0,lineHeight:1.6}}>{emotion.desc}</p></div>
              </div>
            </div>
          </ScrollCard>
        )}
        {ai?.story&&(
          <ScrollCard delay={60}>
            <div style={{background:"linear-gradient(135deg,rgba(139,92,246,0.15),rgba(109,40,217,0.08))",border:"1px solid rgba(196,181,253,0.25)",borderRadius:24,padding:"18px 20px",marginBottom:12}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                <div style={{width:34,height:34,borderRadius:12,background:"rgba(196,181,253,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>📖</div>
                <span style={{fontSize:14,fontWeight:800,color:"rgba(255,255,255,0.9)"}}>나의 탐색 이야기</span>
              </div>
              <p style={{fontSize:14,color:"rgba(255,255,255,0.75)",margin:0,lineHeight:1.8,fontStyle:"italic"}}>{ai.story}</p>
            </div>
          </ScrollCard>
        )}
        <ResultCard icon="🎬" title="지금 이걸 해보세요" text={ai?.action} gradient="linear-gradient(135deg,#1E3A5F,#1E40AF)" delay={120}/>
        <ResultCard icon="🌿" title="이런 기분으로 있어보세요" text={ai?.mood} gradient="linear-gradient(135deg,#064E3B,#065F46)" delay={180}/>
        <ResultCard icon="💼" title="추천 직업" text={ai?.job} gradient="linear-gradient(135deg,#3B1F6E,#4C1D95)" delay={240}/>
        <ResultCard icon="📋" title="오늘의 할 일" text={ai?.todo} gradient="linear-gradient(135deg,#7C2D12,#92400E)" delay={300}/>
        <ResultCard icon="💫" title="AI 한마디" text={ai?.tip} gradient="linear-gradient(135deg,#1F2937,#374151)" delay={360}/>
        {letter&&(
          <ScrollCard delay={420}>
            <div style={{background:"linear-gradient(135deg,#4A0D6F,#701A75)",borderRadius:24,padding:"20px",marginBottom:12,border:"1px solid rgba(232,121,249,0.3)",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:-30,right:-30,width:100,height:100,borderRadius:"50%",background:"rgba(232,121,249,0.1)"}}/>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                <div style={{width:34,height:34,borderRadius:12,background:"rgba(232,121,249,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>💌</div>
                <span style={{fontSize:14,fontWeight:800,color:"rgba(255,255,255,0.9)"}}>AI가 쓴 편지</span>
              </div>
              <p style={{fontSize:14,color:"rgba(255,255,255,0.8)",margin:0,lineHeight:1.8,fontStyle:"italic"}}>{letter}</p>
            </div>
          </ScrollCard>
        )}
        <AiChat path={path} fw={fw}/>
        <ScrollCard delay={540}>
          <button onClick={restart} style={{width:"100%",padding:"17px",borderRadius:20,background:"linear-gradient(135deg,#7C3AED,#6D28D9)",color:"#fff",border:"none",fontSize:16,fontWeight:800,cursor:"pointer",fontFamily:font,boxShadow:"0 8px 32px rgba(109,40,217,0.4)"}}>
            다시 탐색하기 ✨
          </button>
        </ScrollCard>
      </div>
    </Page>
  );

  if(screen==="game") return (
    <Page dir="right" style={{background:"#F8F7FF",fontFamily:font,paddingBottom:100}}>
      <style>{CSS}</style>
      <div style={{background:"linear-gradient(180deg,#2D1464,#4C1D95,#6D28D9)",padding:"24px 20px 28px",borderRadius:"0 0 32px 32px",boxShadow:"0 8px 32px rgba(109,40,217,0.3)"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
          <button onClick={()=>{if(si===0)goTo("home");else{setSi(si-1);setPath(path.slice(0,-1));setSel(null);setHint(null);}}}
            style={{width:36,height:36,borderRadius:12,background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.2)",cursor:"pointer",fontSize:15,color:"#fff"}}>←</button>
          <div style={{display:"flex",gap:5,alignItems:"center"}}>
            {Array.from({length:MAX},(_,i)=>(<div key={i} style={{height:6,borderRadius:20,transition:"all 0.45s cubic-bezier(.4,0,.2,1)",width:i<=si?22:7,background:i<si?"rgba(255,255,255,0.5)":i===si?(isFinal?"#FCD34D":"#fff"):"rgba(255,255,255,0.2)"}}/>))}
          </div>
          <div style={{background:isFinal?"rgba(252,211,77,0.2)":"rgba(255,255,255,0.15)",border:`1px solid ${isFinal?"rgba(252,211,77,0.5)":"rgba(255,255,255,0.2)"}`,borderRadius:20,padding:"5px 14px",fontSize:12,color:isFinal?"#FCD34D":"rgba(255,255,255,0.9)",fontWeight:700}}>
            {isFinal?"마지막 🎯":`${si+1}/${MAX}`}
          </div>
        </div>
        {path.length>1&&(
          <div style={{marginBottom:14}}>
            <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
              {path.slice(0,-1).map((w,i)=>(<span key={i} style={{display:"flex",alignItems:"center",gap:4}}>{i>0&&<span style={{color:"rgba(255,255,255,0.35)",fontSize:11}}>→</span>}<span style={{fontSize:13,fontWeight:700,color:"rgba(255,255,255,0.95)",background:"rgba(255,255,255,0.12)",border:"1px solid rgba(255,255,255,0.2)",padding:"4px 12px",borderRadius:20}}>{w}</span></span>))}
            </div>
          </div>
        )}
        <p style={{fontSize:11,color:"rgba(255,255,255,0.5)",margin:"0 0 3px",fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase"}}>현재 주제</p>
        <h2 style={{fontSize:36,fontWeight:900,margin:0,color:"#fff",letterSpacing:"-1px",textShadow:"0 2px 20px rgba(196,181,253,0.4)"}}>{path[path.length-1]}</h2>
      </div>
      <div style={{padding:"16px 20px 8px"}}>
        {hint&&(
          <div style={{background:"linear-gradient(135deg,#EDE9FE,#F5F3FF)",border:"1.5px solid #C4B5FD",borderRadius:16,padding:"12px 16px",marginBottom:14,display:"flex",alignItems:"center",gap:10,animation:"scaleIn 0.4s ease"}}>
            <span style={{fontSize:20,flexShrink:0}}>🤖</span>
            <p style={{fontSize:13,color:"#4C1D95",margin:0,fontWeight:600}}>{hint}</p>
          </div>
        )}
        <p style={{fontSize:13,color:isFinal?"#D97706":"#A78BFA",margin:0,fontWeight:600}}>
          {isFinal?"✨ 하나를 고르면 AI가 분석해드려요":`${vw.length}개 중 하나를 골라보세요 ↓`}
        </p>
      </div>
      <div style={{padding:"0 20px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        {vw.map((word,i)=>(<Bubble key={word+i} word={word} color={BC[i%BC.length]} size={bsz} selected={sel===i} onClick={()=>handleSel(i)}/>))}
      </div>
      {sel!==null&&(
        <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:390,padding:"16px 20px",background:"rgba(248,247,255,0.92)",backdropFilter:"blur(20px)",borderTop:"1px solid rgba(196,181,253,0.3)"}}>
          <button onClick={next} style={{width:"100%",padding:"16px",borderRadius:20,background:isFinal?"linear-gradient(135deg,#D97706,#B45309)":"linear-gradient(135deg,#7C3AED,#6D28D9)",color:"#fff",border:"none",fontSize:16,fontWeight:800,cursor:"pointer",fontFamily:font,boxShadow:isFinal?"0 6px 24px rgba(217,119,6,0.4)":"0 6px 24px rgba(109,40,217,0.4)"}}>
            {isFinal?`"${vw[sel]}" → AI 분석 받기 ✨`:`"${vw[sel]}" 로 계속 탐색 →`}
          </button>
        </div>
      )}
    </Page>
  );

  return (
    <Page dir="left" style={{background:"linear-gradient(160deg,#1E0A3C,#2D1464,#4C1D95)",fontFamily:font,minHeight:"100vh",padding:"48px 20px 80px",position:"relative",overflow:"hidden"}}>
      <style>{CSS}</style>
      <div style={{position:"absolute",top:-100,right:-80,width:300,height:300,borderRadius:"50%",background:"radial-gradient(circle,rgba(139,92,246,0.25) 0%,transparent 70%)",pointerEvents:"none"}}/>
      <div style={{position:"absolute",bottom:-80,left:-60,width:250,height:250,borderRadius:"50%",background:"radial-gradient(circle,rgba(196,181,253,0.15) 0%,transparent 70%)",pointerEvents:"none"}}/>
      <div style={{position:"relative"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:28}}>
          <h1 style={{fontSize:28,fontWeight:900,color:"#fff",margin:0,textShadow:"0 2px 20px rgba(196,181,253,0.4)"}}>🧠 브레인스토밍</h1>
          <div style={{width:40,height:40,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:14,fontSize:18,cursor:"pointer"}}>⚙️</div>
        </div>
        <div onClick={()=>startGame(dailyWord)} style={{background:"linear-gradient(135deg,rgba(139,92,246,0.4),rgba(109,40,217,0.6))",border:"1px solid rgba(196,181,253,0.3)",borderRadius:24,padding:"18px 22px",marginBottom:14,cursor:"pointer",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:-20,right:-20,width:100,height:100,borderRadius:"50%",background:"rgba(255,255,255,0.05)"}}/>
          <p style={{fontSize:11,color:"rgba(196,181,253,0.8)",margin:"0 0 6px",fontWeight:700,letterSpacing:"0.1em"}}>🎲 오늘의 단어</p>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <p style={{fontSize:30,fontWeight:900,color:"#fff",margin:0,letterSpacing:"-1px"}}>{dailyWord}</p>
            <span style={{fontSize:12,color:"rgba(255,255,255,0.8)",background:"rgba(255,255,255,0.12)",padding:"6px 14px",borderRadius:20,fontWeight:700,border:"1px solid rgba(255,255,255,0.15)"}}>탐색하기 →</span>
          </div>
        </div>
        <div onClick={()=>startGame("오늘")} style={{background:"linear-gradient(135deg,rgba(15,23,42,0.8),rgba(30,58,138,0.6))",border:"1px solid rgba(147,197,253,0.2)",borderRadius:20,padding:"14px 18px",marginBottom:14,cursor:"pointer",display:"flex",alignItems:"center",gap:12}}>
          <span style={{fontSize:26}}>🌙</span>
          <div><p style={{fontSize:14,fontWeight:800,color:"#fff",margin:0}}>오늘 하루 마무리</p><p style={{fontSize:12,color:"rgba(255,255,255,0.5)",margin:0}}>오늘의 감정을 탐색으로 정리해요</p></div>
          <span style={{marginLeft:"auto",color:"rgba(255,255,255,0.3)",fontSize:18}}>→</span>
        </div>
        <div style={{background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:20,padding:"16px",marginBottom:16}}>
          <p style={{fontSize:12,color:"rgba(255,255,255,0.5)",margin:"0 0 10px",fontWeight:600}}>직접 입력</p>
          <div style={{display:"flex",gap:8}}>
            <input value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&inp.trim()&&startGame(inp)}
              placeholder="시작 단어를 입력하세요..."
              style={{flex:1,minWidth:0,fontSize:15,padding:"13px 16px",border:"1px solid rgba(255,255,255,0.15)",borderRadius:14,outline:"none",fontFamily:font,background:"rgba(255,255,255,0.08)",color:"#fff"}}/>
            <button onClick={()=>inp.trim()&&startGame(inp)} style={{flexShrink:0,padding:"13px 20px",fontWeight:800,fontSize:15,background:"linear-gradient(135deg,#7C3AED,#6D28D9)",color:"#fff",border:"none",borderRadius:14,cursor:"pointer",fontFamily:font,boxShadow:"0 4px 16px rgba(109,40,217,0.5)"}}>시작</button>
          </div>
          {err&&<p style={{color:"#FDA4AF",fontSize:13,margin:"8px 0 0"}}>{err}</p>}
        </div>
        <p style={{fontSize:12,color:"rgba(255,255,255,0.5)",margin:"0 0 10px",fontWeight:600}}>카테고리로 시작하기</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:selCat!==null?0:8}}>
          {CATEGORIES.map((cat,i)=>(
            <button key={cat.label} onClick={()=>setSelCat(selCat===i?null:i)}
              style={{padding:"12px 14px",borderRadius:18,background:selCat===i?"rgba(139,92,246,0.4)":"rgba(255,255,255,0.06)",border:`1px solid ${selCat===i?"rgba(196,181,253,0.5)":"rgba(255,255,255,0.1)"}`,cursor:"pointer",fontFamily:font,textAlign:"left",transition:"all 0.2s"}}>
              <span style={{fontSize:16,display:"block",marginBottom:3}}>{cat.emoji}</span>
              <span style={{fontSize:12,fontWeight:700,color:selCat===i?"#E9D5FF":"rgba(255,255,255,0.8)"}}>{cat.label}</span>
            </button>
          ))}
        </div>
        {selCat!==null&&(
          <div style={{marginTop:10,padding:"14px",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:18,animation:"scaleIn 0.3s ease"}}>
            <p style={{fontSize:12,color:"rgba(196,181,253,0.8)",margin:"0 0 8px",fontWeight:600}}>추천 시작 단어</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              {CATEGORIES[selCat].words.map((w,i)=>(
                <button key={w} onClick={()=>startGame(w)}
                  style={{padding:"7px 16px",borderRadius:20,background:BC[i%BC.length].bg,border:`1.5px solid ${BC[i%BC.length].border}`,color:BC[i%BC.length].text,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:font}}>{w}</button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Page>
  );
}

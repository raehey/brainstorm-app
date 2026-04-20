import { useState, useRef, useEffect } from "react";

const THEMES = {
  purple:{ name:"보라",emoji:"💜",primary:"#6D28D9",light:"#EDE9FE",border:"#C4B5FD",soft:"#F8F7FF",grad:"160deg,#EDE9FE,#F8F7FF",text:"#4C1D95",sub:"#A78BFA",dim:"#DDD6FE" },
  blue:  { name:"파랑",emoji:"💙",primary:"#1D4ED8",light:"#EFF6FF",border:"#93C5FD",soft:"#F0F9FF",grad:"160deg,#DBEAFE,#F0F9FF",text:"#1E3A8A",sub:"#60A5FA",dim:"#BFDBFE" },
  green: { name:"초록",emoji:"💚",primary:"#15803D",light:"#ECFDF5",border:"#6EE7B7",soft:"#F0FDF4",grad:"160deg,#D1FAE5,#F0FDF4",text:"#14532D",sub:"#4ADE80",dim:"#BBF7D0" },
  orange:{ name:"주황",emoji:"🧡",primary:"#C2410C",light:"#FFF7ED",border:"#FCD34D",soft:"#FFFBEB",grad:"160deg,#FEF3C7,#FFFBEB",text:"#78350F",sub:"#FBbf24",dim:"#FDE68A" },
  pink:  { name:"핑크",emoji:"🩷",primary:"#9D174D",light:"#FDF2F8",border:"#F9A8D4",soft:"#FFF5F9",grad:"160deg,#FCE7F3,#FFF5F9",text:"#831843",sub:"#F472B6",dim:"#FBCFE8" },
};
const PERSONAS = {
  friend:     { name:"친구처럼",emoji:"🤝",desc:"편하고 따뜻하게" },
  coach:      { name:"코치처럼",emoji:"💪",desc:"동기부여하고 직접적으로" },
  poet:       { name:"시인처럼",emoji:"🌸",desc:"감성적이고 시적으로" },
  philosopher:{ name:"철학자처럼",emoji:"🧐",desc:"깊고 통찰력 있게" },
};
const BC = [
  {bg:"#F0EBFF",border:"#C4B5FD",text:"#5B21B6"},
  {bg:"#ECFDF5",border:"#6EE7B7",text:"#065F46"},
  {bg:"#FFF7ED",border:"#FCD34D",text:"#92400E"},
  {bg:"#FFF1F2",border:"#FDA4AF",text:"#9F1239"},
  {bg:"#EFF6FF",border:"#93C5FD",text:"#1E40AF"},
  {bg:"#F0FDF4",border:"#86EFAC",text:"#166534"},
  {bg:"#FFFBEB",border:"#FDE68A",text:"#78350F"},
  {bg:"#FDF4FF",border:"#E879F9",text:"#701A75"},
];

const MAX=6, HINTS=["커피","주식","여행","창업","건강","음악"];
const countFor = s => s<=2?8:s<=4?6:4;
const font="'Pretendard','Apple SD Gothic Neo','Noto Sans KR',system-ui,sans-serif";
const CSS=`
  @keyframes bnc{0%,80%,100%{transform:scale(0.8);opacity:0.4}40%{transform:scale(1.3);opacity:1}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
  @keyframes slideIn{from{opacity:0;transform:translateX(32px)}to{opacity:1;transform:translateX(0)}}
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
  @keyframes eyeBlink{0%,90%,100%{transform:scaleY(1)}95%{transform:scaleY(0.1)}}
  @keyframes msgIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
`;

function useSound(on) {
  const ctx=useRef(null);
  function gc(){if(!ctx.current)ctx.current=new(window.AudioContext||window.webkitAudioContext)();return ctx.current;}
  return type=>{
    if(!on)return;
    try{
      const ac=gc();
      if(type==="select"){const o=ac.createOscillator(),g=ac.createGain();o.connect(g);g.connect(ac.destination);o.frequency.setValueAtTime(520,ac.currentTime);o.frequency.exponentialRampToValueAtTime(700,ac.currentTime+0.1);g.gain.setValueAtTime(0.1,ac.currentTime);g.gain.exponentialRampToValueAtTime(0.001,ac.currentTime+0.15);o.start();o.stop(ac.currentTime+0.15);}
      else if(type==="next"){const o=ac.createOscillator(),g=ac.createGain();o.connect(g);g.connect(ac.destination);o.frequency.setValueAtTime(440,ac.currentTime);o.frequency.exponentialRampToValueAtTime(880,ac.currentTime+0.15);g.gain.setValueAtTime(0.08,ac.currentTime);g.gain.exponentialRampToValueAtTime(0.001,ac.currentTime+0.2);o.start();o.stop(ac.currentTime+0.2);}
      else if(type==="done"){[0,0.12,0.24].forEach((t,i)=>{const o=ac.createOscillator(),g=ac.createGain();o.connect(g);g.connect(ac.destination);o.frequency.value=[523,659,784][i];g.gain.setValueAtTime(0.1,ac.currentTime+t);g.gain.exponentialRampToValueAtTime(0.001,ac.currentTime+t+0.25);o.start(ac.currentTime+t);o.stop(ac.currentTime+t+0.25);});}
    }catch{}
  };
}

function exportImage(path, fw, ai, themeKey) {
  const t=THEMES[themeKey];
  const cv=document.createElement('canvas'); cv.width=1080; cv.height=1080;
  const c=cv.getContext('2d');
  const gr=c.createLinearGradient(0,0,1080,1080); gr.addColorStop(0,t.light); gr.addColorStop(1,t.soft);
  c.fillStyle=gr; c.fillRect(0,0,1080,1080);
  c.fillStyle=t.primary; c.fillRect(0,0,1080,10);
  c.font='bold 54px system-ui'; c.fillStyle=t.text; c.fillText('🧠 브레인스토밍 결과',80,110);
  let px=80;
  c.font='bold 26px system-ui';
  path.forEach((w,i)=>{
    const col=BC[i%BC.length]; const tw=c.measureText(w).width+40;
    c.fillStyle=col.border; rr(c,px,137,tw,42,21); c.fillStyle='#fff'; c.fillText(w,px+20,165);
    px+=tw+12; if(i<path.length-1){c.fillStyle=t.dim;c.fillText('→',px,165);px+=32;}
  });
  c.fillStyle=t.primary; rr(c,80,200,920,120,28);
  c.fillStyle='#fff'; c.font='bold 30px system-ui'; c.fillText('최종 키워드',110,252);
  c.font='bold 60px system-ui'; c.fillText('🎯 '+(fw||''),110,330);
  const cards=[
    {icon:'🎬',title:'지금 이걸 해보세요',text:ai?.action||''},
    {icon:'💼',title:'추천 직업',text:ai?.job||''},
    {icon:'📋',title:'오늘의 할 일',text:ai?.todo||''},
  ];
  cards.forEach((card,i)=>{
    const y=370+i*210;
    c.fillStyle='rgba(255,255,255,0.9)'; rr(c,80,y,920,190,24);
    c.fillStyle=t.text; c.font='bold 28px system-ui'; c.fillText(card.icon+' '+card.title,110,y+48);
    c.fillStyle='#374151'; c.font='24px system-ui';
    const ws=card.text.split(' '); let line='',ly=y+90;
    ws.forEach(w=>{const test=line+w+' ';if(c.measureText(test).width>860&&line){c.fillText(line.trim(),110,ly);line=w+' ';ly+=34;}else line=test;});
    if(line)c.fillText(line.trim(),110,ly);
  });
  c.fillStyle=t.dim; c.font='22px system-ui'; c.fillText('brainstorm-app-eight.vercel.app',80,1050);
  function rr(ctx,x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.quadraticCurveTo(x+w,y,x+w,y+r);ctx.lineTo(x+w,y+h-r);ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);ctx.lineTo(x+r,y+h);ctx.quadraticCurveTo(x,y+h,x,y+h-r);ctx.lineTo(x,y+r);ctx.quadraticCurveTo(x,y,x+r,y);ctx.closePath();ctx.fill();}
  cv.toBlob(blob=>{const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='brainstorm.png';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
}

function Bubble({word,color,size,selected,onClick,ripple}){
  const fs=size==="lg"?16:size==="md"?14:12;
  const py=size==="lg"?22:size==="md"?18:14;
  const lines=word.length>7?[word.slice(0,Math.ceil(word.length/2)),word.slice(Math.ceil(word.length/2))]:[word];
  return (
    <button onClick={onClick} style={{width:"100%",padding:`${py}px 12px`,background:selected?color.border:color.bg,border:`2px solid ${color.border}`,borderRadius:9999,cursor:"pointer",fontFamily:font,fontSize:fs,fontWeight:700,color:selected?"#fff":color.text,transition:"all 0.18s ease",transform:selected?"scale(0.95)":"scale(1)",boxShadow:ripple?`0 0 18px ${color.border}bb`:selected?`0 4px 16px ${color.border}88`:"none",textAlign:"center",lineHeight:1.5}}>
      {lines.map((ln,i)=><span key={i} style={{display:"block"}}>{ln}</span>)}
    </button>
  );
}

function AiChat({t, path, fw, persona}) {
  const [msgs,setMsgs]=useState([{role:"assistant",text:`"${fw}" 탐색 결과에 대해 궁금한 게 있으면 뭐든 물어보세요 😊`}]);
  const [inp,setInp]=useState("");
  const [loading,setLoading]=useState(false);
  const bottomRef=useRef(null);
  const PERSONA_PROMPT = {
    friend:"친한 친구처럼 편하고 따뜻하게 반말로",
    coach:"열정적인 코치처럼 동기부여하며 직접적으로",
    poet:"감성적인 시인처럼 시적으로",
    philosopher:"깊은 철학자처럼 통찰력 있게",
  }[persona]||"친구처럼";

  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"});},[msgs]);

  async function send(){
    if(!inp.trim()||loading)return;
    const userMsg=inp.trim(); setInp("");
    setMsgs(m=>[...m,{role:"user",text:userMsg}]);
    setLoading(true);
    try {
      const history=msgs.slice(1).map(m=>({role:m.role,content:m.text}));
      const res=await fetch("/api/brainstorm",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({mode:"chat",path,fw,persona,message:userMsg,history})});
      const data=await res.json();
      setMsgs(m=>[...m,{role:"assistant",text:data.reply||"다시 물어봐줘!"}]);
    } catch { setMsgs(m=>[...m,{role:"assistant",text:"앗, 오류가 났어요. 다시 시도해주세요!"}]); }
    setLoading(false);
  }

  return (
    <div style={{border:`1.5px solid ${t.border}`,borderRadius:20,overflow:"hidden",marginBottom:12}}>
      <div style={{background:t.light,padding:"12px 16px",display:"flex",alignItems:"center",gap:8}}>
        <span style={{fontSize:16}}>💬</span>
        <span style={{fontSize:13,fontWeight:800,color:t.text}}>AI와 대화하기</span>
        <span style={{marginLeft:"auto",fontSize:11,color:t.sub}}>추가 질문 가능해요</span>
      </div>
      <div style={{background:"#fff",padding:"12px",maxHeight:260,overflowY:"auto"}}>
        {msgs.map((m,i)=>(
          <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",marginBottom:8,animation:"msgIn 0.25s ease"}}>
            <div style={{maxWidth:"80%",padding:"10px 14px",borderRadius:m.role==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px",background:m.role==="user"?t.primary:t.light,color:m.role==="user"?"#fff":t.text,fontSize:13,lineHeight:1.6,fontFamily:font}}>
              {m.text}
            </div>
          </div>
        ))}
        {loading&&(
          <div style={{display:"flex",gap:4,padding:"8px 14px"}}>
            {[0,1,2].map(i=><div key={i} style={{width:7,height:7,borderRadius:"50%",background:t.border,animation:`bnc 1s ${i*0.15}s infinite`}}/>)}
          </div>
        )}
        <div ref={bottomRef}/>
      </div>
      <div style={{background:"#fff",borderTop:`1px solid ${t.border}`,padding:"10px 12px",display:"flex",gap:8}}>
        <input value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}
          placeholder="궁금한 것을 물어보세요..."
          style={{flex:1,minWidth:0,fontSize:13,padding:"9px 14px",border:`1.5px solid ${t.border}`,borderRadius:12,outline:"none",fontFamily:font,background:t.soft}}/>
        <button onClick={send} disabled={!inp.trim()||loading}
          style={{padding:"9px 16px",borderRadius:12,background:t.primary,color:"#fff",border:"none",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:font,flexShrink:0}}>전송</button>
      </div>
    </div>
  );
}

function Onboarding({t, onDone}) {
  const [idx,setIdx]=useState(0);
  const slides=[
    {e:"🧠",ti:"브레인스토밍",d:"머릿속 생각을\n단어로 꺼내보세요"},
    {e:"🔗",ti:"연결하고 탐색",d:"6단계를 거쳐\n생각이 이어져요"},
    {e:"✨",ti:"AI 맞춤 제안",d:"직업·할일·투자까지\nAI와 대화할 수 있어요"},
  ];
  const s=slides[idx];
  return (
    <div style={{maxWidth:390,margin:"0 auto",minHeight:"100vh",background:`linear-gradient(${t.grad})`,fontFamily:font,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"2rem"}}>
      <style>{CSS}</style>
      <div style={{textAlign:"center",marginBottom:48,animation:"fadeUp 0.5s ease"}}>
        <div style={{fontSize:72,marginBottom:24}}>{s.e}</div>
        <h2 style={{fontSize:28,fontWeight:900,color:t.text,margin:"0 0 12px"}}>{s.ti}</h2>
        <p style={{fontSize:16,color:t.sub,lineHeight:1.7,margin:0,whiteSpace:"pre-line"}}>{s.d}</p>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:40}}>
        {slides.map((_,i)=><div key={i} onClick={()=>setIdx(i)} style={{width:i===idx?24:8,height:8,borderRadius:20,background:i===idx?t.primary:t.dim,transition:"all 0.3s",cursor:"pointer"}}/>)}
      </div>
      {idx<slides.length-1
        ?<button onClick={()=>setIdx(idx+1)} style={{width:"100%",maxWidth:300,padding:"16px",borderRadius:20,background:t.primary,color:"#fff",border:"none",fontSize:16,fontWeight:800,cursor:"pointer",fontFamily:font}}>다음 →</button>
        :<button onClick={onDone} style={{width:"100%",maxWidth:300,padding:"16px",borderRadius:20,background:t.primary,color:"#fff",border:"none",fontSize:16,fontWeight:800,cursor:"pointer",fontFamily:font}}>시작하기 🚀</button>
      }
    </div>
  );
}

function Settings({t, tk, setTk, persona, setPersona, snd, setSnd, onBack}) {
  return (
    <div style={{maxWidth:390,margin:"0 auto",minHeight:"100vh",background:t.soft,fontFamily:font,paddingBottom:40,animation:"slideIn 0.3s ease"}}>
      <style>{CSS}</style>
      <div style={{padding:"24px 20px 16px",background:"#fff",borderBottom:`1px solid ${t.border}`}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <button onClick={onBack} style={{width:34,height:34,borderRadius:10,background:t.light,border:"none",cursor:"pointer",fontSize:15,color:t.primary}}>←</button>
          <h2 style={{fontSize:20,fontWeight:900,color:t.text,margin:0}}>설정</h2>
        </div>
      </div>
      <div style={{padding:"20px"}}>
        <p style={{fontSize:12,color:t.sub,fontWeight:700,margin:"0 0 10px"}}>테마 색상</p>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:24}}>
          {Object.entries(THEMES).map(([k,th])=>(
            <button key={k} onClick={()=>setTk(k)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,padding:"12px 16px",borderRadius:16,background:k===tk?"#fff":t.light,border:`2px solid ${k===tk?th.primary:t.border}`,cursor:"pointer",fontFamily:font,transition:"all 0.2s"}}>
              <span style={{fontSize:22}}>{th.emoji}</span>
              <span style={{fontSize:12,fontWeight:700,color:k===tk?th.primary:t.sub}}>{th.name}</span>
            </button>
          ))}
        </div>
        <p style={{fontSize:12,color:t.sub,fontWeight:700,margin:"0 0 10px"}}>AI 페르소나</p>
        <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:24}}>
          {Object.entries(PERSONAS).map(([k,p])=>(
            <button key={k} onClick={()=>setPersona(k)} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 16px",borderRadius:16,background:k===persona?"#fff":t.light,border:`2px solid ${k===persona?t.primary:t.border}`,cursor:"pointer",fontFamily:font,textAlign:"left",transition:"all 0.2s"}}>
              <span style={{fontSize:24}}>{p.emoji}</span>
              <div><p style={{fontSize:14,fontWeight:800,color:k===persona?t.text:"#6B7280",margin:0}}>{p.name}</p><p style={{fontSize:12,color:t.sub,margin:0}}>{p.desc}</p></div>
              {k===persona&&<span style={{marginLeft:"auto",color:t.primary,fontSize:18}}>✓</span>}
            </button>
          ))}
        </div>
        <button onClick={()=>setSnd(s=>!s)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",padding:"14px 16px",borderRadius:16,background:"#fff",border:`1.5px solid ${t.border}`,cursor:"pointer",fontFamily:font}}>
          <span style={{fontSize:14,fontWeight:700,color:t.text}}>{snd?"🔊 효과음 켜짐":"🔇 효과음 꺼짐"}</span>
          <div style={{width:44,height:24,borderRadius:20,background:snd?t.primary:t.dim,position:"relative",transition:"background 0.3s"}}>
            <div style={{position:"absolute",top:2,left:snd?22:2,width:20,height:20,borderRadius:"50%",background:"#fff",transition:"left 0.3s"}}/>
          </div>
        </button>
      </div>
    </div>
  );
}

export default function App(){
  const [tk,setTk]=useState("purple");
  const [persona,setPersona]=useState("friend");
  const [snd,setSnd]=useState(true);
  const [screen,setScreen]=useState("onboarding");
  const [inp,setInp]=useState("");
  const [si,setSi]=useState(0);
  const [words,setWords]=useState([]);
  const [sel,setSel]=useState(null);
  const [path,setPath]=useState([]);
  const [fw,setFw]=useState(null);
  const [ai,setAi]=useState(null);
  const [hist,setHist]=useState([]);
  const [ripple,setRipple]=useState(null);
  const [err,setErr]=useState("");
  const [copied,setCopied]=useState(false);
  const play=useSound(snd);
  const t=THEMES[tk];
  const isFinal=si===MAX-1;
  const vw=words.slice(0,countFor(si+1));
  const bsz=vw.length<=4?"lg":vw.length<=6?"md":"sm";

  // 공유 링크로 접속 시 결과 바로 표시
  useEffect(()=>{
    const params=new URLSearchParams(window.location.search);
    const sharedPath=params.get("path");
    const sharedFw=params.get("fw");
    if(sharedPath&&sharedFw){
      const p=sharedPath.split(",").map(w=>w.trim()).filter(Boolean);
      setPath(p); setFw(sharedFw);
      setAi({action:"공유된 결과예요! 직접 탐색해서 나만의 결과를 만들어보세요.",mood:"열린 마음으로 탐색을 시작해보세요.",job:"이 흐름과 어울리는 다양한 역할이 있어요.",todo:"① 직접 탐색해보기\n② 결과 비교하기\n③ 나만의 경로 만들기",tip:"같은 시작, 다른 경로 — 당신만의 답을 찾아보세요."});
      setScreen("result");
    }
  },[]);

  async function fetchWords(topic, count, exclude=[]) {
    const res=await fetch("/api/brainstorm",{method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({topic,count,exclude})});
    const data=await res.json();
    return data.words||[];
  }

  async function startGame(topic) {
    if(!topic.trim())return;
    setErr(""); setScreen("loading");
    try {
      const ws=await fetchWords(topic,countFor(1),[]);
      if(ws.length<2){setErr("다시 시도해주세요.");setScreen("home");return;}
      setPath([topic]); setWords(ws); setSi(0); setSel(null); setScreen("game");
    } catch { setErr("오류가 발생했어요."); setScreen("home"); }
  }

  function handleSel(i){
    play("select"); setSel(sel===i?null:i);
    setRipple(i); setTimeout(()=>setRipple(null),400);
    if(navigator.vibrate)navigator.vibrate(30);
  }

  async function next(){
    if(sel===null)return;
    play("next");
    const word=vw[sel]; const np=[...path,word];
    setPath(np); setSel(null);
    if(isFinal){
      setFw(word); setScreen("loading");
      try {
        const res=await fetch("/api/brainstorm",{method:"POST",headers:{"Content-Type":"application/json"},
          body:JSON.stringify({topic:word,path:np,mode:"suggest",persona})});
        const data=await res.json();
        play("done");
        setAi(data);
        const rec={id:Date.now(),path:np,finalWord:word,date:new Date().toLocaleDateString("ko").slice(5,10).replace(". ","."),persona};
        setHist(h=>[rec,...h]);
        setScreen("result");
      } catch { setScreen("result"); }
    } else {
      setScreen("loading");
      try {
        const ws=await fetchWords(word,countFor(si+2),np);
        if(ws.length>=2){setWords(ws);setSi(si+1);setScreen("game");}
        else{setErr("다시 시도해주세요.");setScreen("game");}
      } catch { setErr("오류가 발생했어요."); setScreen("game"); }
    }
  }

  function restart(){
    setScreen("home"); setInp(""); setPath([]); setWords([]);
    setSi(0); setSel(null); setAi(null); setFw(null); setErr("");
    window.history.replaceState({},"",window.location.pathname);
  }

  function shareLink(){
    const url=`${window.location.origin}?path=${encodeURIComponent(path.join(","))}&fw=${encodeURIComponent(fw||"")}`;
    navigator.clipboard.writeText(url).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2500);});
  }

  if(screen==="onboarding") return <Onboarding t={t} onDone={()=>setScreen("home")}/>;
  if(screen==="settings") return <Settings t={t} tk={tk} setTk={setTk} persona={persona} setPersona={setPersona} snd={snd} setSnd={setSnd} onBack={()=>setScreen("home")}/>;

  if(screen==="loading") return (
    <div style={{maxWidth:390,margin:"0 auto",minHeight:"100vh",background:`linear-gradient(${t.grad})`,fontFamily:font,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:24}}>
      <style>{CSS}</style>
      <div style={{position:"relative",animation:"float 2s ease-in-out infinite"}}>
        <svg width="110" height="110" viewBox="0 0 110 110">
          <ellipse cx="55" cy="62" rx="36" ry="30" fill={t.border} opacity="0.3"/>
          <ellipse cx="55" cy="60" rx="34" ry="28" fill={t.light} stroke={t.border} strokeWidth="2.5"/>
          <path d="M30 52 Q38 44 46 52 Q54 60 62 52 Q70 44 78 52" fill="none" stroke={t.border} strokeWidth="2" strokeLinecap="round"/>
          <path d="M34 62 Q42 56 50 62 Q58 68 66 62 Q72 56 78 62" fill="none" stroke={t.border} strokeWidth="2" strokeLinecap="round"/>
          <path d="M32 72 Q40 66 50 72 Q60 78 70 72" fill="none" stroke={t.border} strokeWidth="2" strokeLinecap="round"/>
          <g style={{animation:"eyeBlink 3s infinite"}}>
            <ellipse cx="44" cy="57" rx="4" ry="4.5" fill={t.primary}/>
            <ellipse cx="66" cy="57" rx="4" ry="4.5" fill={t.primary}/>
          </g>
          <ellipse cx="44" cy="55.5" rx="1.5" ry="2" fill="white"/>
          <ellipse cx="66" cy="55.5" rx="1.5" ry="2" fill="white"/>
          <ellipse cx="36" cy="63" rx="5" ry="3" fill={t.border} opacity="0.5"/>
          <ellipse cx="74" cy="63" rx="5" ry="3" fill={t.border} opacity="0.5"/>
          <path d="M47 68 Q55 74 63 68" fill="none" stroke={t.primary} strokeWidth="2.5" strokeLinecap="round"/>
          <text x="18" y="30" fontSize="14" style={{animation:"bnc 1.5s 0s infinite"}}>✨</text>
          <text x="76" y="22" fontSize="12" style={{animation:"bnc 1.5s 0.3s infinite"}}>⭐</text>
          <text x="82" y="50" fontSize="10" style={{animation:"bnc 1.5s 0.6s infinite"}}>💫</text>
        </svg>
        <div style={{position:"absolute",top:-8,left:"50%",transform:"translateX(-50%)",background:t.primary,color:"#fff",borderRadius:20,padding:"4px 12px",fontSize:11,fontWeight:800,whiteSpace:"nowrap"}}>생각 중... 🤔</div>
      </div>
      <p style={{fontSize:17,fontWeight:800,color:t.text,margin:0}}>AI가 분석하고 있어요</p>
      <div style={{display:"flex",gap:8}}>{[0,1,2].map(i=><div key={i} style={{width:9,height:9,borderRadius:"50%",background:t.primary,animation:`bnc 1.2s ${i*0.2}s infinite`}}/>)}</div>
    </div>
  );

  if(screen==="result") return (
    <div style={{maxWidth:390,margin:"0 auto",minHeight:"100vh",background:t.soft,fontFamily:font,paddingBottom:40,animation:"slideIn 0.3s ease"}}>
      <style>{CSS}</style>
      <div style={{padding:"24px 20px 20px",background:"#fff",borderBottom:`1px solid ${t.border}`}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
          <button onClick={restart} style={{width:34,height:34,borderRadius:10,background:t.light,border:"none",cursor:"pointer",fontSize:15,color:t.primary}}>←</button>
          <span style={{fontSize:12,color:t.sub,fontWeight:700}}>완료 🎉</span>
          <div style={{display:"flex",gap:6}}>
            <button onClick={shareLink} style={{padding:"6px 12px",borderRadius:12,background:copied?"#ECFDF5":t.light,border:`1.5px solid ${copied?"#6EE7B7":t.border}`,color:copied?"#065F46":t.primary,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:font,transition:"all 0.2s"}}>
              {copied?"✓ 복사됨!":"🔗 공유"}
            </button>
            <button onClick={()=>exportImage(path,fw,ai,tk)} style={{padding:"6px 12px",borderRadius:12,background:t.light,border:`1.5px solid ${t.border}`,color:t.primary,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:font}}>🖼️</button>
          </div>
        </div>
        <p style={{fontSize:11,color:t.dim,margin:"0 0 8px",fontWeight:600,letterSpacing:"0.05em"}}>탐색 경로</p>
        <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:16}}>
          {path.map((w,i)=>(
            <span key={i} style={{display:"flex",alignItems:"center",gap:5}}>
              {i>0&&<span style={{color:t.dim,fontSize:12}}>→</span>}
              <span style={{fontSize:13,fontWeight:700,color:"#fff",background:BC[i%BC.length].border,padding:"4px 12px",borderRadius:20}}>{w}</span>
            </span>
          ))}
        </div>
        <div style={{background:`linear-gradient(135deg,${t.text},${t.primary})`,borderRadius:20,padding:"18px 20px"}}>
          <p style={{fontSize:11,color:t.dim,margin:"0 0 4px",fontWeight:600}}>최종 키워드</p>
          <p style={{fontSize:30,fontWeight:900,margin:0,color:"#fff"}}>🎯 {fw}</p>
        </div>
      </div>
      <div style={{padding:"20px"}}>
        <div style={{background:t.light,borderRadius:14,padding:"10px 14px",marginBottom:14,display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:16}}>{PERSONAS[persona].emoji}</span>
          <span style={{fontSize:12,color:t.sub,fontWeight:700}}>{PERSONAS[persona].name} 스타일 분석</span>
        </div>
        {[
          {icon:"🎬",title:"지금 이걸 해보세요",text:ai?.action,bg:"#fff",tc:"#374151"},
          {icon:"🌿",title:"이런 기분으로 있어보세요",text:ai?.mood,bg:"#fff",tc:"#374151"},
          {icon:"💼",title:"추천 직업",text:ai?.job,bg:t.light,tc:t.sub},
          {icon:"📋",title:"오늘의 할 일 3가지",text:ai?.todo,bg:t.light,tc:t.sub},
          {icon:"💫",title:"AI 한마디",text:ai?.tip,bg:"#fff",tc:t.text},
        ].map((card,i)=>(
          <div key={i} style={{background:card.bg,border:`1.5px solid ${t.border}`,borderRadius:20,padding:"16px 18px",marginBottom:10,animation:`fadeUp 0.4s ${i*0.07}s both ease`}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
              <span style={{fontSize:18}}>{card.icon}</span>
              <span style={{fontSize:13,fontWeight:800,color:t.text}}>{card.title}</span>
            </div>
            <p style={{fontSize:14,color:card.tc,margin:0,lineHeight:1.7,whiteSpace:"pre-line"}}>{card.text}</p>
          </div>
        ))}

        {ai?.invest&&(
          <div style={{border:"1.5px solid #FCD34D",borderRadius:20,overflow:"hidden",marginBottom:10}}>
            <div style={{background:"#FEF3C7",padding:"12px 18px",display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:18}}>📈</span>
              <span style={{fontSize:13,fontWeight:800,color:"#78350F"}}>투자 참고 정보</span>
              <span style={{marginLeft:"auto",fontSize:10,background:"#FDE68A",color:"#92400E",padding:"2px 8px",borderRadius:20,fontWeight:700}}>참고용</span>
            </div>
            <div style={{background:"#fff",padding:"14px 18px"}}>
              <p style={{fontSize:12,fontWeight:700,color:"#92400E",margin:"0 0 6px"}}>🎯 투자 테마</p>
              <p style={{fontSize:14,color:"#374151",margin:"0 0 12px",lineHeight:1.6}}>{ai.invest.theme}</p>
              <p style={{fontSize:12,fontWeight:700,color:"#92400E",margin:"0 0 6px"}}>🏢 관련 종목 (참고용)</p>
              <p style={{fontSize:14,color:"#374151",margin:"0 0 12px",lineHeight:1.6}}>{ai.invest.stocks}</p>
              <p style={{fontSize:12,fontWeight:700,color:"#92400E",margin:"0 0 6px"}}>📦 관련 ETF</p>
              <p style={{fontSize:14,color:"#374151",margin:"0 0 12px",lineHeight:1.6}}>{ai.invest.etf}</p>
              <p style={{fontSize:12,fontWeight:700,color:"#92400E",margin:"0 0 6px"}}>🧠 투자 마인드셋</p>
              <p style={{fontSize:14,color:"#374151",margin:"0 0 14px",lineHeight:1.6}}>{ai.invest.mindset}</p>
              <div style={{background:"#FEF9C3",borderRadius:12,padding:"10px 14px",borderLeft:"3px solid #FCD34D"}}>
                <p style={{fontSize:11,color:"#92400E",margin:0,lineHeight:1.6}}>{ai.invest.disclaimer}</p>
              </div>
            </div>
          </div>
        )}

        <AiChat t={t} path={path} fw={fw} persona={persona}/>
        <button onClick={restart} style={{width:"100%",marginTop:8,padding:"16px",borderRadius:18,background:t.primary,color:"#fff",border:"none",fontSize:16,fontWeight:800,cursor:"pointer",fontFamily:font}}>다시 탐색하기</button>
      </div>
    </div>
  );

  if(screen==="home") return (
    <div style={{maxWidth:390,margin:"0 auto",minHeight:"100vh",background:`linear-gradient(${t.grad})`,fontFamily:font,padding:"50px 20px 40px"}}>
      <style>{CSS}</style>
      <div style={{marginBottom:28}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
          <h1 style={{fontSize:26,fontWeight:900,color:t.text,margin:0,whiteSpace:"nowrap"}}>🧠 브레인스토밍</h1>
          <button onClick={()=>setScreen("settings")} style={{flexShrink:0,marginLeft:12,width:38,height:38,display:"flex",alignItems:"center",justifyContent:"center",background:"#fff",border:`1.5px solid ${t.border}`,borderRadius:12,cursor:"pointer",fontSize:20}}>⚙️</button>
        </div>
        <div style={{display:"inline-flex",alignItems:"center",gap:6,background:t.light,borderRadius:12,padding:"5px 10px"}}>
          <span style={{fontSize:13}}>{PERSONAS[persona].emoji}</span>
          <span style={{fontSize:11,color:t.sub,fontWeight:700}}>{PERSONAS[persona].name} 모드</span>
        </div>
      </div>
      <div style={{background:"#fff",borderRadius:24,padding:"20px",marginBottom:20,boxShadow:`0 4px 24px ${t.border}44`,border:`1.5px solid ${t.border}`}}>
        <p style={{fontSize:12,color:t.dim,margin:"0 0 10px",fontWeight:600}}>시작 단어 입력</p>
        <div style={{display:"flex",gap:8}}>
          <input value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&startGame(inp)}
            placeholder="무엇이든 입력해보세요..."
            style={{flex:1,minWidth:0,fontSize:15,padding:"13px 16px",border:`1.5px solid ${t.border}`,borderRadius:14,outline:"none",fontFamily:font,background:t.soft}}/>
          <button onClick={()=>startGame(inp)} style={{flexShrink:0,padding:"13px 20px",fontWeight:800,fontSize:15,background:t.primary,color:"#fff",border:"none",borderRadius:14,cursor:"pointer",fontFamily:font,whiteSpace:"nowrap"}}>시작</button>
        </div>
        {err&&<p style={{color:"#EF4444",fontSize:13,margin:"8px 0 0"}}>{err}</p>}
      </div>
      <p style={{fontSize:12,color:t.dim,margin:"0 0 10px",fontWeight:600,paddingLeft:4}}>추천 주제</p>
      <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:28}}>
        {HINTS.map((s,i)=>(<button key={s} onClick={()=>startGame(s)} style={{fontSize:14,padding:"9px 18px",borderRadius:20,color:BC[i].text,background:BC[i].bg,border:`1.5px solid ${BC[i].border}`,cursor:"pointer",fontWeight:700,fontFamily:font}}>{s}</button>))}
      </div>
      {hist.length>0&&(
        <>
          <p style={{fontSize:12,color:t.dim,fontWeight:600,margin:"0 0 10px",paddingLeft:4}}>최근 탐색</p>
          {hist.slice(0,2).map(h=>(
            <div key={h.id} style={{background:"#fff",border:`1.5px solid ${t.border}`,borderRadius:18,padding:"14px 16px",marginBottom:8,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div>
                <span style={{fontSize:14,fontWeight:800,color:t.text}}>🎯 {h.finalWord}</span>
                <div style={{fontSize:11,color:t.sub,marginTop:3}}>{h.path[0]} → ... → {h.finalWord} {PERSONAS[h.persona]?.emoji}</div>
              </div>
              <span style={{fontSize:11,color:t.dim}}>{h.date}</span>
            </div>
          ))}
        </>
      )}
    </div>
  );

  return (
    <div style={{maxWidth:390,margin:"0 auto",minHeight:"100vh",background:t.soft,fontFamily:font,paddingBottom:100,animation:"slideIn 0.3s ease"}}>
      <style>{CSS}</style>
      <div style={{padding:"24px 20px 20px",borderBottom:`1px solid ${t.border}`,background:"#fff"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
          <button onClick={()=>{if(si===0)setScreen("home");else{setSi(si-1);setPath(path.slice(0,-1));setSel(null);}}}
            style={{width:34,height:34,borderRadius:10,background:t.light,border:"none",cursor:"pointer",fontSize:15,color:t.primary}}>←</button>
          <div style={{display:"flex",gap:5}}>
            {Array.from({length:MAX},(_,i)=>(<div key={i} style={{width:i<=si?20:7,height:7,borderRadius:20,background:i<si?t.border:i===si?(isFinal?"#F59E0B":t.primary):t.light,transition:"all 0.4s"}}/>))}
          </div>
          <div style={{background:isFinal?"#FEF3C7":t.light,borderRadius:12,padding:"5px 12px",fontSize:12,color:isFinal?"#D97706":t.primary,fontWeight:700}}>
            {isFinal?"마지막 🎯":`${si+1}/${MAX}`}
          </div>
        </div>
        {path.length>1&&(
          <div style={{marginBottom:14}}>
            <p style={{fontSize:11,color:t.dim,margin:"0 0 8px",fontWeight:600,letterSpacing:"0.05em",textTransform:"uppercase"}}>탐색 경로</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
              {path.slice(0,-1).map((w,i)=>(
                <span key={i} style={{display:"flex",alignItems:"center",gap:5}}>
                  {i>0&&<span style={{color:t.dim,fontSize:12}}>→</span>}
                  <span style={{fontSize:14,fontWeight:800,color:"#fff",background:BC[i%BC.length].border,padding:"5px 14px",borderRadius:20,boxShadow:`0 2px 8px ${BC[i%BC.length].border}66`}}>{w}</span>
                </span>
              ))}
            </div>
          </div>
        )}
        <div>
          <p style={{fontSize:11,color:t.dim,margin:"0 0 4px",fontWeight:600,letterSpacing:"0.05em",textTransform:"uppercase"}}>현재 주제</p>
          <h2 style={{fontSize:36,fontWeight:900,margin:0,color:t.text,letterSpacing:"-1px"}}>{path[path.length-1]}</h2>
        </div>
        <div style={{marginTop:14,height:5,background:t.light,borderRadius:20,overflow:"hidden"}}>
          <div style={{width:`${((si+1)/MAX)*100}%`,height:"100%",background:isFinal?"#F59E0B":t.primary,borderRadius:20,transition:"width 0.5s ease"}}/>
        </div>
      </div>
      <div style={{padding:"16px 20px 8px"}}>
        <p style={{fontSize:13,color:isFinal?"#D97706":t.sub,margin:0,fontWeight:600}}>
          {isFinal?"✨ 하나를 고르면 AI가 분석해드려요":`${vw.length}개 중 하나를 골라보세요 ↓`}
        </p>
      </div>
      <div style={{padding:"0 20px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        {vw.map((word,i)=>(<Bubble key={word+i} word={word} color={BC[i%BC.length]} size={bsz} selected={sel===i} onClick={()=>handleSel(i)} ripple={ripple===i}/>))}
      </div>
      {sel!==null&&(
        <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:390,padding:"16px 20px",background:"#fff",borderTop:`1px solid ${t.border}`}}>
          <button onClick={next} style={{width:"100%",padding:"16px",borderRadius:18,background:isFinal?"#D97706":t.primary,color:"#fff",border:"none",fontSize:16,fontWeight:800,cursor:"pointer",fontFamily:font}}>
            {isFinal?`"${vw[sel]}" → AI 분석 받기 ✨`:`"${vw[sel]}" 로 계속 탐색 →`}
          </button>
        </div>
      )}
    </div>
  );
}

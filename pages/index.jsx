async function next(){
    if(sel===null)return;
    const word=vw[sel]; const np=[...path,word];
    setPath(np); setSel(null); setHint(null);

    if(isFinal){
      setFw(word); goTo("loading");
      setParticles(true); setTimeout(()=>setParticles(false),1000);
      try {
        const res=await fetch("/api/brainstorm",{
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify({topic:word,path:np,mode:"suggest",persona:"friend"})
        });
        const d=await res.json();
        setAi(d); setLetter(d.letter||null); setEmotion(d.emotion||null);
      } catch(e) {
        console.error("suggest error",e);
        setAi({action:"한 가지부터!",mood:"편안하게.",job:"창의적인 역할이 맞아.",todo:"① 기록 ② 탐색 ③ 실천",tip:"이 흐름에 답이 있어.",story:`${np[0]}에서 시작한 여정이 ${word}에 닿았어.`});
      }
      goTo("result");
      return;
    }

    // 다음 단계 단어 불러오기
    const nextSi = si + 1;
    const needed = countFor(nextSi + 1);

    goTo("loading");
    try {
      const res = await fetch("/api/brainstorm",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({topic: word, count: needed, exclude: np})
      });
      const d = await res.json();
      const ws = d.words || [];

      if(ws.length >= 2){
        setWords(ws);
        setSi(nextSi);
        goTo("game");
        if(nextSi === 2){
          fetch("/api/brainstorm",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({mode:"hint", path:np})
          }).then(r=>r.json()).then(d=>{ if(d.hint) setHint(d.hint); }).catch(()=>{});
        }
      } else {
        // 단어가 부족하면 exclude 없이 재시도
        const res2 = await fetch("/api/brainstorm",{
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify({topic: word, count: needed, exclude: []})
        });
        const d2 = await res2.json();
        const ws2 = d2.words || [];
        if(ws2.length >= 2){
          setWords(ws2);
          setSi(nextSi);
          goTo("game");
        } else {
          setErr("단어를 불러오지 못했어요. 다시 시도해주세요.");
          setPath(path); // 경로 복원
          goTo("game");
        }
      }
    } catch(e) {
      console.error("next error", e);
      setErr("오류가 발생했어요. 다시 시도해주세요.");
      setPath(path); // 경로 복원
      goTo("game");
    }
  }

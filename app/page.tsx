
'use client';
import { useEffect, useState } from 'react';

type Q = any;

export default function Page(){
  const [userId,setUserId]=useState('');
  const [questions,setQuestions]=useState<Q[]>([]);
  const [idx,setIdx]=useState(0);
  const [selected,setSelected]=useState<number|null>(null);
  const [showExp,setShowExp]=useState(false);
  const [xp,setXp]=useState(0);
  const [level,setLevel]=useState(1);
  const [streak,setStreak]=useState(1);
  const [mode,setMode]=useState<'home'|'quiz'>('home');
  const [loading,setLoading]=useState(false);
  const [mapelAktif,setMapelAktif]=useState('all');
  const [correct,setCorrect]=useState(0);

  useEffect(()=>{
    let id=localStorage.getItem('tka_userId');
    if(!id){ id='user_'+Math.random().toString(36).slice(2,7); localStorage.setItem('tka_userId',id); }
    setUserId(id);
    fetch(`/api/progress?userId=${id}`).then(r=>r.json()).then(j=>{ if(j.data){ setXp(parseInt(j.data.xp||0)); setLevel(parseInt(j.data.level||1)); setStreak(parseInt(j.data.streak||1)); } }).catch(()=>{});
  },[]);

  const load = async (mapel:string, limit=50)=>{
    setLoading(true); setMapelAktif(mapel);
    try{
      const r=await fetch(`/api/questions?mapel=${mapel}&limit=${limit}&offset=${Math.floor(Math.random()*80)}`);
      const j=await r.json();
      setQuestions(j.data); setIdx(0); setSelected(null); setShowExp(false); setMode('quiz'); setCorrect(0);
    }catch{ alert('Gagal load soal'); }
    setLoading(false);
  };

  const jawab = async (i:number)=>{
    if(selected!==null) return;
    setSelected(i); setShowExp(true);
    const isCorrect = i===questions[idx].kunci;
    if(isCorrect) setCorrect(c=>c+1);
    try{
      const res=await fetch('/api/progress',{method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({userId, xp:isCorrect?20:5, mapel:questions[idx].mapel, isCorrect, questionId:questions[idx].id})});
      const d=await res.json(); if(d.xp) setXp(d.xp); if(d.level) setLevel(d.level); if(d.streak) setStreak(d.streak);
      if(!d.xp){ setXp(x=>x+(isCorrect?20:5)); if((xp+20)%200===0) setLevel(l=>l+1); }
    }catch{ setXp(x=>x+(isCorrect?20:5)); }
  };

  const next = ()=>{ if(idx < questions.length-1){ setIdx(idx+1); setSelected(null); setShowExp(false); } else { setMode('home'); } };

  const cur = questions[idx];
  const pct = questions.length ? ((idx+1)/questions.length)*100 : 0;

  return (
    <main className="min-h-screen bg-[#f7f7fb] text-zinc-900">
      {/* Header clean fokus latihan */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-zinc-200">
        <div className="max-w-[1100px] mx-auto px-4 md:px-6 h-[64px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 text-white flex items-center justify-center font-extrabold text-[13px]">TKA</div>
            <div><p className="font-bold text-[14px] leading-none">TKA Perhotelan</p><p className="text-[11px] opacity-60 leading-none mt-1">Fokus Latihan Soal • Kelas 12 SMK</p></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 bg-zinc-100 rounded-full px-3 py-1.5 text-[12px]"><span>🔥</span><b>{streak}</b> streak</div>
            <div className="flex items-center gap-2 bg-zinc-900 text-white rounded-full px-4 py-1.5 text-[12px]"><span className="opacity-70">LV {level}</span><span className="w-px h-3 bg-white/20 mx-1"/><b>{xp} XP</b></div>
          </div>
        </div>
      </header>

      <div className="max-w-[1100px] mx-auto px-4 md:px-6 py-6 md:py-8">
        {mode==='home' ? (
          <>
            <div className="mb-8">
              <h1 className="text-[28px] md:text-[36px] font-extrabold tracking-tight leading-[1.1]">Latihan Soal TKA<br/>SMK Perhotelan</h1>
              <p className="text-[14px] opacity-60 mt-3 max-w-[560px]">Pilih mata pelajaran, kerjakan soal, langsung dapat penjelasan lengkap dengan analogi hotel. 1000 soal tersedia via API, bukan dummy.</p>
            </div>

            <div className="grid md:grid-cols-12 gap-4">
              {/* Tryout Utama */}
              <button onClick={()=>load('all',50)} className="md:col-span-8 text-left group rounded-[20px] bg-zinc-900 text-white p-6 md:p-7 hover:bg-black transition relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[240px] h-[240px] bg-gradient-to-br from-violet-500/30 to-cyan-400/20 rounded-full blur-[30px] group-hover:scale-110 transition duration-700"/>
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">🚀</div>
                  <h2 className="mt-4 text-[20px] font-bold">Tryout Campur TKA</h2>
                  <p className="text-[13px] opacity-70 mt-1">50 soal random dari 4 mapel • Simulasi ujian asli • 60 menit</p>
                  <div className="mt-5 inline-flex items-center gap-2 text-[12px] bg-white/10 rounded-full px-3 py-1.5">Mulai Tryout →</div>
                </div>
              </button>

              <div className="md:col-span-4 rounded-[20px] bg-white border border-zinc-200 p-5">
                <p className="text-[12px] font-bold uppercase tracking-widest opacity-50">Progress Kamu</p>
                <div className="mt-3 flex items-baseline gap-2"><p className="text-[32px] font-extrabold">{questions.length?Math.round(correct/questions.length*100):0}%</p><p className="text-[12px] opacity-60">akurasi terakhir</p></div>
                <div className="mt-3 h-2 bg-zinc-100 rounded-full overflow-hidden"><div className="h-full bg-zinc-900 rounded-full transition-all" style={{width:`${Math.min(100, correct*10)}%`}}/></div>
                <p className="text-[11px] opacity-50 mt-2">XP {xp} • Level {level} • {userId}</p>
              </div>

              {[
                {id:'indonesia', name:'Bahasa Indonesia', topik:'Ide Pokok • EYD • Majas • Teks Prosedur', soal:'250 soal', icon:'📝', color:'bg-[#fff1f2] border-[#ffe4e6]'},
                {id:'matematika', name:'Matematika', topik:'Diskon Kamar • Okupansi • Peluang', soal:'250 soal', icon:'📊', color:'bg-[#eff6ff] border-[#dbeafe]'},
                {id:'inggris', name:'Bahasa Inggris', topik:'Hospitality English • Handling Complaint', soal:'250 soal', icon:'💬', color:'bg-[#fefce8] border-[#fef08a]'},
                {id:'perhotelan', name:'Perhotelan Pilihan', topik:'Front Office • Housekeeping • F&B • LARK', soal:'250 soal', icon:'🏨', color:'bg-[#f5f3ff] border-[#ddd6fe]'},
              ].map(card=>(
                <button key={card.id} onClick={()=>load(card.id, 100)} className={`md:col-span-3 text-left rounded-[20px] border p-5 hover:-translate-y-0.5 hover:shadow-lg transition-all ${card.color}`}>
                  <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-[18px]">{card.icon}</div>
                  <h3 className="mt-4 font-bold text-[15px]">{card.name}</h3>
                  <p className="text-[11px] opacity-60 mt-1 leading-snug">{card.topik}</p>
                  <div className="mt-4 flex items-center justify-between"><span className="text-[11px] bg-white border border-zinc-200 rounded-full px-2.5 py-1">{card.soal} via API</span><span className="text-[12px]">→</span></div>
                </button>
              ))}
            </div>

            <div className="mt-8 rounded-[16px] bg-white border border-zinc-200 p-4 text-[12px] opacity-60 flex gap-2">
              <span>ℹ️</span><span>Semua soal diambil dari <b>/api/questions</b> (generator, bukan file besar). Progress disimpan realtime di Upstash Redis key <b>user:{userId}</b>. Fokus latihan, tanpa distraksi.</span>
            </div>
          </>
        ) : (
          <div className="max-w-[720px] mx-auto">
            {loading ? (
              <div className="py-24 text-center"><div className="w-8 h-8 border-2 border-zinc-200 border-t-zinc-900 rounded-full animate-spin mx-auto"/><p className="mt-3 text-[13px] opacity-60">Memuat soal dari API...</p></div>
            ) : cur && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <button onClick={()=>setMode('home')} className="text-[12px] opacity-60 hover:opacity-100">← Kembali</button>
                  <div className="text-[11px] opacity-60">{cur.mapel.toUpperCase()} • {cur.topik} • {idx+1}/{questions.length}</div>
                </div>
                <div className="h-1 bg-zinc-200 rounded-full overflow-hidden mb-6"><div className="h-full bg-zinc-900 rounded-full transition-all duration-500" style={{width:`${pct}%`}}/></div>

                <div className="rounded-[20px] bg-white border border-zinc-200 shadow-sm p-6 md:p-7">
                  <h2 className="text-[18px] md:text-[20px] font-bold leading-[1.35]">{cur.pertanyaan}</h2>

                  <div className="mt-6 space-y-2.5">
                    {cur.opsi.map((op:string,i:number)=>{
                      const isSel = selected===i;
                      const isCorrect = i===cur.kunci;
                      let base = "w-full text-left rounded-xl border p-4 flex gap-3 items-start transition hover:bg-zinc-50";
                      if(selected!==null){
                        if(isCorrect) base = "w-full text-left rounded-xl border p-4 flex gap-3 items-start bg-emerald-50 border-emerald-300";
                        else if(isSel && !isCorrect) base = "w-full text-left rounded-xl border p-4 flex gap-3 items-start bg-red-50 border-red-300";
                        else base = "w-full text-left rounded-xl border p-4 flex gap-3 items-start opacity-50 bg-zinc-50";
                      }
                      return (
                        <button key={i} onClick={()=>jawab(i)} className={base}>
                          <div className={`w-7 h-7 rounded-full border flex items-center justify-center text-[11px] font-bold shrink-0 ${selected!==null && isCorrect ? 'bg-emerald-600 text-white border-emerald-600' : isSel && !isCorrect ? 'bg-red-600 text-white border-red-600' : 'bg-white border-zinc-300'}`}>{String.fromCharCode(65+i)}</div>
                          <span className="text-[14px] leading-[1.4]">{op}</span>
                          {selected!==null && isCorrect && <span className="ml-auto text-emerald-600 text-[12px]">✓ Benar</span>}
                        </button>
                      );
                    })}
                  </div>

                  {showExp && (
                    <div className="mt-6">
                      <div className={`rounded-xl p-4 border ${selected===cur.kunci ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
                        <p className="font-bold text-[13px]">{selected===cur.kunci ? '✅ Jawaban Benar' : '❌ Belum Tepat'}</p>
                        <div className="mt-3 space-y-2.5 text-[13px] leading-relaxed">
                          <p><b>Kenapa benar:</b> {cur.penjelasan_benar}</p>
                          <p><b>Kenapa salah:</b> {cur.kenapa_salah}</p>
                          <p className="bg-white rounded-lg border border-zinc-200 p-2.5"><b>🏨 Analogi Hotel:</b> {cur.analogi_hotel}</p>
                          <p className="bg-zinc-900 text-white rounded-lg p-2.5"><b>⚡ Tips TKA:</b> {cur.tips}</p>
                        </div>
                      </div>
                      <button onClick={next} className="mt-4 w-full h-12 rounded-xl bg-zinc-900 text-white font-bold text-[14px] hover:bg-black transition">
                        {idx===questions.length-1 ? 'Selesai • Kembali ke Latihan' : 'Soal Berikutnya →'}
                      </button>
                    </div>
                  )}
                </div>

                <div className="mt-4 text-center text-[11px] opacity-40">Soal {idx+1} dari {questions.length} • {mapelAktif} • API: /api/questions</div>
              </>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

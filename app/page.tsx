'use client';
import { useEffect, useState } from 'react';

type Q = any;

export default function Home(){
  const [userId, setUserId] = useState('');
  const [mapel, setMapel] = useState('all');
  const [questions, setQuestions] = useState<Q[]>([]);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number|null>(null);
  const [showExplain, setShowExplain] = useState(false);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(1);
  const [loading, setLoading] = useState(false);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [mode, setMode] = useState<'dashboard'|'quiz'>('dashboard');
  const [correctCount, setCorrectCount] = useState(0);

  useEffect(()=>{
    let id = localStorage.getItem('tka_userId');
    if(!id){ id = 'user_'+Math.random().toString(36).slice(2,9); localStorage.setItem('tka_userId', id); }
    setUserId(id);
    fetchProgress(id);
    fetchLeaderboard();
  },[]);

  const fetchProgress = async (uid:string)=>{
    try{
      const res = await fetch(`/api/progress?userId=${uid}`);
      const j = await res.json();
      if(j.data){ setXp(parseInt(j.data.xp||'0')); setLevel(parseInt(j.data.level||'1')); setStreak(parseInt(j.data.streak||'1')); }
    }catch{}
  };
  const fetchLeaderboard = async()=>{
    try{ const r=await fetch('/api/leaderboard'); const j=await r.json(); setLeaderboard(j.leaderboard||[]); }catch{}
  };
  const loadQuestions = async (m:string, lim=50)=>{
    setLoading(true);
    try{
      const r = await fetch(`/api/questions?mapel=${m}&limit=${lim}&offset=${Math.floor(Math.random()*50)}`);
      const j = await r.json();
      setQuestions(j.data); setIdx(0); setSelected(null); setShowExplain(false); setMode('quiz'); setCorrectCount(0);
    }catch{ alert('Gagal load soal, cek koneksi'); }
    setLoading(false);
  };

  const handleAnswer = async (i:number)=>{
    if(selected!==null) return;
    setSelected(i);
    setShowExplain(true);
    const isCorrect = i===questions[idx].kunci;
    if(isCorrect) setCorrectCount(c=>c+1);
    // save to redis
    try{
      await fetch('/api/progress', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ userId, xp: isCorrect?20:5, mapel: questions[idx].mapel, correct: questions[idx].kunci, isCorrect, questionId: questions[idx].id }) });
      if(isCorrect){ setXp(x=>x+20); } else setXp(x=>x+5);
      if((xp+20)%200===0) setLevel(l=>l+1);
    }catch{}
  };

  const nextQ = ()=>{
    if(idx < questions.length-1){ setIdx(idx+1); setSelected(null); setShowExplain(false); }
    else { alert(`Selesai! Benar ${correctCount+ (selected===questions[idx].kunci?1:0)}/${questions.length}. XP +${correctCount*20}`); setMode('dashboard'); fetchProgress(userId); fetchLeaderboard(); }
  };

  const cur = questions[idx];

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center glass rounded-3xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-400 flex items-center justify-center font-bold">TKA</div>
            <div><h1 className="font-bold">TKA PRO Perhotelan</h1><p className="text-xs opacity-60">Realtime • Upstash Redis • 800+ Soal</p></div>
          </div>
          <div className="flex gap-3 text-sm">
            <div className="glass rounded-xl px-3 py-2">🔥 {streak} Streak</div>
            <div className="glass rounded-xl px-3 py-2">⭐ {xp} XP</div>
            <div className="bg-gradient-to-br from-violet-600 to-cyan-400 rounded-xl px-3 py-2 font-bold">Lv {level}</div>
          </div>
        </header>

        {mode==='dashboard' ? (
          <>
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              {[
                { id:'all', name:'Tryout Campur TKA', desc:'50 soal random 4 mapel', color:'from-violet-600 to-indigo-600', count: '800+' },
                { id:'indonesia', name:'Bahasa Indonesia', desc:'250 soal • EYD & Teks', color:'from-pink-600 to-rose-600', count:'250' },
                { id:'matematika', name:'Matematika', desc:'250 soal • Diskon & Okupansi', color:'from-cyan-600 to-blue-600', count:'250' },
                { id:'inggris', name:'Bahasa Inggris', desc:'250 soal • Hospitality English', color:'from-amber-600 to-orange-600', count:'250' },
              ].map(card=>(
                <div key={card.id} onClick={()=>loadQuestions(card.id, card.id==='all'?50:200)} className={`cursor-pointer glass rounded-[28px] p-6 hover:scale-[1.02] transition bg-gradient-to-br ${card.color} bg-opacity-20`}>
                  <div className="text-3xl mb-3">{card.id==='all'?'🚀':card.id==='indonesia'?'🇮🇩':card.id==='matematika'?'📊':'🇬🇧'}</div>
                  <h3 className="font-bold text-lg">{card.name}</h3>
                  <p className="text-xs opacity-70 mt-1">{card.desc}</p>
                  <div className="mt-4 flex justify-between items-center"><span className="text-xs bg-white/20 rounded-full px-2 py-1">{card.count} soal via API</span><span className="text-sm">▶️</span></div>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="glass rounded-3xl p-5">
                <h4 className="font-bold mb-3">📚 Perhotelan Pilihan (250 soal)</h4>
                <p className="text-sm opacity-70 mb-4">Front Office, Housekeeping, F&B Service, Handling Complaint LARK, Room Status</p>
                <button onClick={()=>loadQuestions('perhotelan',200)} className="w-full bg-white text-black rounded-xl py-3 font-bold hover:bg-gray-200">Mulai 200 Soal Perhotelan</button>
              </div>
              <div className="glass rounded-3xl p-5 md:col-span-2">
                <h4 className="font-bold mb-3">🏆 Leaderboard Realtime (Redis)</h4>
                <div className="space-y-2">
                  {leaderboard.length===0 ? <p className="text-sm opacity-60">Belum ada data, jadi yang pertama yuk! Data dari Upstash Redis Sorted Set.</p> : leaderboard.map((l,i)=>(
                    <div key={l.userId} className="flex justify-between glass rounded-xl px-3 py-2 text-sm"><span>#{i+1} {l.userId.slice(0,8)} • Lv {l.level}</span><span className="font-bold">{l.xp} XP 🔥{l.streak}</span></div>
                  ))}
                </div>
                <div className="mt-4 text-xs opacity-50">UserID kamu: {userId} • Progress tersimpan di Redis key user:{userId}</div>
              </div>
            </div>

            <div className="mt-6 glass rounded-3xl p-5">
              <h4 className="font-bold">⚙️ Cara Kerja API (Bukan Dummy)</h4>
              <code className="text-xs block mt-2 bg-black/50 p-3 rounded-xl">
                GET /api/questions?mapel=matematika&limit=200 → generator 200 soal unik (bukan file)<br/>
                POST /api/progress → simpan ke Upstash Redis HASH user:xxx<br/>
                GET /api/leaderboard → ZREVRANGE leaderboard realtime
              </code>
            </div>
          </>
        ) : (
          <div className="max-w-3xl mx-auto">
            {loading ? <div className="text-center py-20">Loading 200+ soal dari API...</div> : cur && (
              <div className="glass rounded-[32px] p-6 md:p-8">
                <div className="flex justify-between text-xs opacity-60 mb-4"><span>{cur.mapel.toUpperCase()} • {cur.topik} • Soal {idx+1}/{questions.length}</span><span className="bg-white/10 px-2 py-1 rounded-full">{cur.level}</span></div>
                <h2 className="text-xl md:text-2xl font-bold leading-snug mb-6">{cur.pertanyaan}</h2>
                <div className="space-y-3">
                  {cur.opsi.map((op:string,i:number)=>{
                    const isSel = selected===i;
                    const isCorrect = i===cur.kunci;
                    let cls = "glass rounded-2xl p-4 text-left hover:bg-white/10 cursor-pointer transition";
                    if(selected!==null){
                      if(isCorrect) cls = "bg-green-500/20 border border-green-400 rounded-2xl p-4 text-left";
                      else if(isSel && !isCorrect) cls = "bg-red-500/20 border border-red-400 rounded-2xl p-4 text-left";
                      else cls = "glass rounded-2xl p-4 text-left opacity-50";
                    }
                    return <button key={i} onClick={()=>handleAnswer(i)} className={cls}><span className="font-bold mr-3">{String.fromCharCode(65+i)}.</span>{op} {selected!==null && isCorrect && "✅"} {isSel && !isCorrect && "❌"}</button>;
                  })}
                </div>

                {showExplain && (
                  <div className="mt-6 space-y-4 animate-in">
                    <div className={`rounded-2xl p-4 ${selected===cur.kunci ? "bg-green-500/10 border border-green-500/30" : "bg-amber-500/10 border border-amber-500/30"}`}>
                      <h4 className="font-bold">{selected===cur.kunci ? "🎉 Benar! Mantap Future Hotelier!" : "💡 Hampir! Yuk pahami lagi"}</h4>
                      <p className="text-sm mt-2"><b>Kenapa Benar:</b> {cur.penjelasan_benar}</p>
                      <p className="text-sm mt-2"><b>Kenapa Pilihan Lain Salah:</b> {cur.kenapa_salah}</p>
                      <p className="text-sm mt-2"><b>Analogi Hotel:</b> {cur.analogi_hotel}</p>
                      <div className="text-xs mt-3 bg-black/40 p-2 rounded-xl"><b>Tips TKA:</b> {cur.tips}</div>
                    </div>
                    <button onClick={nextQ} className="w-full bg-gradient-to-r from-violet-600 to-cyan-500 rounded-2xl py-4 font-bold text-lg">{idx===questions.length-1 ? "Selesai & Simpan ke Redis" : "Lanjut Soal Berikutnya →"}</button>
                  </div>
                )}
              </div>
            )}
            <button onClick={()=>setMode('dashboard')} className="mt-6 text-sm opacity-60">← Kembali ke Dashboard</button>
          </div>
        )}
      </div>
    </main>
  );
}

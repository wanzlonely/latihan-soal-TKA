import { Question, Mapel } from "./types";

function randInt(i: number, min: number, max: number){
  // deterministic pseudo-random based on i
  const x = Math.sin(i * 9999) * 10000;
  return Math.floor((x - Math.floor(x)) * (max - min + 1)) + min;
}
function pick<T>(i:number, arr:T[]):T{ return arr[i % arr.length]; }

const indonesiaTemplates = [
  (i:number): Question => {
    const topiks = ["Ide Pokok","Majas","Teks Prosedur","EYD","Teks Negosiasi","Opini Fakta"];
    const topik = pick(i, topiks);
    const texts = [
      `Bacalah kutipan: "Pelayanan prima adalah kunci utama dalam industri perhotelan. Tamu yang puas akan kembali lagi." Ide pokok paragraf tersebut adalah...`,
      `Kalimat "Pelayanan hotel itu bagaikan mentari pagi yang menghangatkan tamu" mengandung majas...`,
      `Manakah penulisan yang sesuai EYD untuk laporan perhotelan?`,
    ];
    const q = pick(i, texts);
    const opsiMap: Record<string,string[]> = {
      "ide": ["Kepuasan tamu berasal dari pelayanan prima","Hotel harus punya banyak kamar","Tamu selalu komplain","Harga kamar mahal"],
      "majas": ["Metafora","Personifikasi","Hiperbola","Simile"],
      "eyd": ["Check-in tamu dilaksanakan pukul 14.00 WIB.","check in tamu di laksanakan pukul 14:00 WIB","Check in tamu dilaksanakan pukul 14.00 WIB.","Check-in Tamu Dilaksanakan Pukul 14.00 WIB"]
    };
    let opsi = i%3===0?opsiMap["ide"]:i%3===1?opsiMap["majas"]:opsiMap["eyd"];
    return {
      id: `ind-${i}`,
      mapel: "indonesia",
      level: pick(i, ["mudah","sedang","sulit"] as any),
      topik,
      pertanyaan: `${q} (Soal #${i+1})`,
      opsi,
      kunci: i%4===0?0:1,
      penjelasan_benar: `Jawaban benar karena sesuai dengan definisi ${topik}. Dalam konteks perhotelan, memahami ${topik} penting untuk membuat SOP dan komunikasi profesional.`,
      kenapa_salah: `Pilihan lain salah karena tidak mencakup makna utama / tidak sesuai kaidah bahasa. Sering terjebak karena mirip, tapi perhatikan kata kunci.`,
      analogi_hotel: `Bayangkan kamu FO: kalau ${topik} berantakan, tamu bingung seperti baca petunjuk check-in yang typo.`,
      tips: `TKA Trick: Cari kata yang diulang, itu biasanya ide pokok. Untuk EYD, ingat: check-in pakai strip, pukul pakai titik.`
    };
  }
];

const matematikaTemplates = [
  (i:number): Question => {
    const price = 500000 + randInt(i,0,20)*50000;
    const disc = [10,15,20,25,30,40][i%6];
    const finalPrice = price - price*disc/100;
    return {
      id: `mtk-${i}`,
      mapel: "matematika",
      level: pick(i, ["mudah","sedang","sulit"] as any),
      topik: "Diskon & Aritmatika Sosial",
      pertanyaan: `Kamar Superior harga Rp ${price.toLocaleString("id-ID")} diskon ${disc}% untuk tamu member. Berapa harga akhir yang dibayar tamu?`,
      opsi: [`Rp ${finalPrice.toLocaleString("id-ID")}`, `Rp ${(price - 50000).toLocaleString("id-ID")}`, `Rp ${(price*disc/100).toLocaleString("id-ID")}`, `Rp ${(price+50000).toLocaleString("id-ID")}`],
      kunci: 0,
      penjelasan_benar: `Diskon = ${disc}% x ${price} = ${price*disc/100}. Harga akhir = ${price} - ${price*disc/100} = ${finalPrice}. Rumus cepat: Harga akhir = Harga x (100%-diskon)`,
      kenapa_salah: `Jangan tertukar diskon dengan harga akhir. Banyak yang jawab nilai diskonnya saja, bukan harga setelah diskon.`,
      analogi_hotel: `Seperti di Front Office kasih harga promo OTA, harus cepat hitung biar tamu gak nunggu lama.`,
      tips: `Trik TKA: 10% = geser 1 nol, 20% = x2 dari 10%. Hitung cepat tanpa kalkulator.`
    };
  },
  (i:number): Question => {
    const total = 120 + randInt(i,0,30);
    const occ = 65 + randInt(i,0,20);
    const terisi = Math.floor(total*occ/100);
    return {
      id: `mtk-${i}-occ`,
      mapel: "matematika",
      level: "sedang",
      topik: "Peluang & Okupansi",
      pertanyaan: `Hotel memiliki ${total} kamar. Okupansi hari ini ${occ}%. Berapa kamar yang terisi? Jika 1 dari ${terisi} tamu komplain, peluang terambil tamu komplain adalah?`,
      opsi: [`${terisi} kamar, peluang 1/${terisi}`, `${total-occ} kamar, peluang 1/${total}`, `${occ} kamar, peluang ${occ}%`, `${total} kamar, peluang 0`],
      kunci: 0,
      penjelasan_benar: `Kamar terisi = ${occ}% x ${total} = ${terisi}. Peluang = kasus yang diinginkan / total kasus = 1/${terisi}.`,
      kenapa_salah: `Jangan pakai total kamar sebagai penyebut peluang jika soalnya tanya dari yang terisi saja. Baca konteks.`,
      analogi_hotel: `Housekeeping butuh data ini buat tau berapa kamar harus dibersihkan hari ini.`,
      tips: `Okupansi = (Kamar Terjual / Kamar Tersedia) x 100%`
    };
  }
];

const inggrisTemplates = [
  (i:number): Question => {
    const situations = [
      { q: "Tamu: 'My AC is not working.' Respon FO terbaik?", opts: ["Let me check it for you right away, I apologize for the inconvenience.", "It's not my job.", "Wait.", "No AC today."], ans: 0 },
      { q: "Complete: 'We ___ the room since morning.' (present perfect)", opts: ["have cleaned","cleaned","are cleaning","will clean"], ans: 0 },
      { q: "What is 'overbooking' in hospitality?", opts: ["More bookings than available rooms","No booking","Free room","Late check-out"], ans: 0 },
    ];
    const s = pick(i, situations);
    return {
      id: `eng-${i}`,
      mapel: "inggris",
      level: pick(i, ["mudah","sedang"] as any),
      topik: "Hospitality English",
      pertanyaan: `${s.q} (Q#${i+1})`,
      opsi: s.opts,
      kunci: s.ans,
      penjelasan_benar: `Dalam hospitality English, kita harus pakai bahasa sopan, empathy, dan offer solution. Present perfect dipakai untuk aksi yang selesai tapi efeknya masih terasa.`,
      kenapa_salah: `Pilihan lain terlalu kasar / grammar salah. Di TKA, perhatikan sopan santun dan tenses.`,
      analogi_hotel: `Bayangkan kamu FO hadapi bule komplain, jawaban harus LARK: Listen, Apologize, Resolve.`,
      tips: `Hafal phrase: "Let me... I apologize... Would you like...?"`
    };
  }
];

const perhotelanTemplates = [
  (i:number): Question => {
    const cases = [
      { q: "Status kamar OI artinya?", o: ["Occupied Dirty - tamu masih menginap tapi kamar kotor","Occupied Clean","Out of Order","Out of Inventory"], k:0, exp:"OI harus di-clean saat tamu keluar." },
      { q: "Urutan table set American Service yang benar?", o: ["Dinner plate, napkin, fork left, knife & spoon right","Spoon dulu baru plate","Random","Hanya garpu"], k:0, exp:"Aturan: Fork kiri, knife & spoon kanan." },
      { q: "Prosedur LARK saat komplain adalah?", o: ["Listen, Apologize, Resolve, Keep in touch","Laugh, Argue, Run, Kick","Listen, Ask, Reply, Kill","Late, Absent, Rude, Kidding"], k:0, exp:"LARK adalah SOP handling complaint internasional." },
      { q: "Tamu early check-in jam 10 padahal check-in jam 14. FO harus?", o: ["Cek ketersediaan kamar ready, tawarkan titip bagasi & welcome drink","Tolak langsung","Suruh tunggu di luar","Kasih kamar kotor"], k:0, exp:"Prioritaskan solusi, jangan tolak mentah." },
    ];
    const c = pick(i, cases);
    return {
      id: `hotel-${i}`,
      mapel: "perhotelan",
      level: pick(i, ["sedang","sulit","hoti"] as any),
      topik: "Front Office & Housekeeping",
      pertanyaan: `${c.q} (Studi Kasus #${i+1})`,
      opsi: c.o,
      kunci: c.k,
      penjelasan_benar: c.exp + " Ini sesuai SOP PHRI dan standar bintang 4-5.",
      kenapa_salah: "Pilihan lain melanggar SOP pelayanan prima dan bisa bikin rating OTA turun.",
      analogi_hotel: "Seperti jadi nakhoda kapal: satu salah prosedur, semua tamu merasakan.",
      tips: "Hafal singkatan: OI, OC, OD, OOO, OOS, LARK, CICO."
    };
  }
];

function generateForMapel(mapel: Mapel, count: number, startOffset=0): Question[]{
  const out: Question[] = [];
  for(let i=0;i<count;i++){
    const idx = startOffset + i;
    let q: Question;
    if(mapel==="matematika"){
      const tpl = pick(idx, matematikaTemplates);
      q = tpl(idx);
    } else if(mapel==="perhotelan"){
      q = perhotelanTemplates[0](idx);
    } else if(mapel==="inggris"){
      q = inggrisTemplates[0](idx);
    } else {
      q = indonesiaTemplates[0](idx);
    }
    // variasi id unik
    q.id = `${mapel}-${idx}-${Math.floor(Math.random()*1000)}`;
    out.push(q);
  }
  return out;
}

export function generateQuestions(mapel: Mapel, limit=200, offset=0): Question[]{
  if(mapel==="all"){
    const each = Math.floor(limit/4);
    return [
      ...generateForMapel("indonesia", each, offset),
      ...generateForMapel("matematika", each, offset+each),
      ...generateForMapel("inggris", each, offset+each*2),
      ...generateForMapel("perhotelan", each, offset+each*3),
    ].sort(()=>Math.random()-0.5);
  }
  return generateForMapel(mapel, limit, offset);
}

export function getTotalCounts(){
  return { indonesia: 250, matematika: 250, inggris: 250, perhotelan: 250, total: 1000 };
}


import { Mapel, Question } from "./types";
function randInt(i:number,min:number,max:number){ const x=Math.sin(i*9999)*10000; return Math.floor((x-Math.floor(x))*(max-min+1))+min; }
function pick<T>(i:number, arr:T[]):T{ return arr[i%arr.length]; }

const genID = (mapel:string, i:number)=> `${mapel}-${i}-${randInt(i,100,999)}`;

export function generateQuestions(mapel: Mapel, limit=200, offset=0): Question[]{
  const out: Question[] = [];
  for(let i=0;i<limit;i++){
    const idx = offset + i;
    if(mapel==="all"){
      const sub = ["indonesia","matematika","inggris","perhotelan"][i%4] as Mapel;
      out.push(genOne(sub, idx));
    }else{
      out.push(genOne(mapel, idx));
    }
  }
  if(mapel==="all") return out.sort(()=>Math.random()-0.5);
  return out;
}

function genOne(mapel: Mapel, idx:number): Question{
  if(mapel==="matematika"){
    const price = 400000 + randInt(idx,0,30)*25000;
    const disc = [10,15,20,25,30][idx%5];
    const finalPrice = price - Math.floor(price*disc/100);
    const occTotal = 100 + randInt(idx,0,80);
    const occPct = 60 + randInt(idx,0,35);
    const useDiskon = idx%2===0;
    if(useDiskon){
      return { id: genID(mapel,idx), mapel, level: pick(idx,["mudah","sedang","sulit"] as any), topik:"Diskon Kamar", pertanyaan:`Kamar Deluxe harga Rp ${price.toLocaleString("id-ID")} diskon ${disc}% untuk member. Berapa harga akhir?`, opsi:[`Rp ${finalPrice.toLocaleString("id-ID")}`,`Rp ${(price*disc/100).toLocaleString("id-ID")}`,`Rp ${(price-50000).toLocaleString("id-ID")}`,`Rp ${price.toLocaleString("id-ID")}`], kunci:0, penjelasan_benar:`Harga akhir = Harga x (100%-${disc}%) = ${price} x ${100-disc}% = ${finalPrice}. Rumus cepat: potong 10% dulu baru kali.`, kenapa_salah:`Banyak yang jawab nilai diskonnya saja, bukan harga setelah diskon. Baca soal sampai akhir.`, analogi_hotel:`Di FO kamu harus cepat hitung biar tamu tidak menunggu lama saat check-in.`, tips:`10% = geser 1 nol, 20% = 2x 10%` };
    }else{
      const terisi = Math.floor(occTotal*occPct/100);
      return { id: genID(mapel,idx), mapel, level:"sedang", topik:"Okupansi", pertanyaan:`Hotel punya ${occTotal} kamar, okupansi ${occPct}%. Berapa kamar terisi? Jika 1 kamar komplain AC, peluangnya?`, opsi:[`${terisi} kamar, peluang 1/${terisi}`,`${occTotal} kamar, peluang 1/${occTotal}`,`${occPct} kamar`, `${occTotal-occPct} kamar`], kunci:0, penjelasan_benar:`Terisi = ${occPct}% x ${occTotal} = ${terisi}. Peluang = 1/${terisi}.`, kenapa_salah:`Jangan pakai total kamar kalau yang ditanya dari yang terisi saja.`, analogi_hotel:`Data okupansi dipakai HK untuk siapkan kamar.`, tips:`Okupansi = Terjual / Tersedia x 100%` };
    }
  }
  if(mapel==="perhotelan"){
    const cases = [
      {q:"Status kamar OI artinya?", o:["Occupied Dirty - tamu masih menginap tapi kotor","Occupied Clean","Out of Order","Out of Inventory"], k:0, top:"Room Status"},
      {q:"Urutan table set American Service yang benar?", o:["Dinner plate di tengah, fork kiri, knife & spoon kanan","Spoon dulu","Random","Hanya garpu"], k:0, top:"F&B Service"},
      {q:"Prosedur LARK saat komplain adalah?", o:["Listen, Apologize, Resolve, Keep in touch","Laugh, Argue, Run, Kick","Listen, Ask, Reply, Kill","Late, Absent, Rude"], k:0, top:"Handling Complaint"},
      {q:"Tamu early check-in jam 10 padahal jam 14, FO harus?", o:["Cek kamar ready, tawarkan titip bagasi & welcome drink","Tolak langsung","Suruh tunggu di luar","Kasih kamar kotor"], k:0, top:"Front Office"},
      {q:"Fungsi Room Boy adalah?", o:["Membersihkan kamar & replenish amenity","Menjual kamar","Menghitung revenue","Memasak"], k:0, top:"Housekeeping"},
    ];
    const c = pick(idx, cases);
    return { id: genID(mapel,idx), mapel, level: pick(idx,["mudah","sedang","sulit"] as any), topik:c.top, pertanyaan:`${c.q}`, opsi:c.o, kunci:c.k, penjelasan_benar:`${c.q} jawabannya ${c.o[c.k]}. Sesuai SOP PHRI bintang 4-5.`, kenapa_salah:`Pilihan lain melanggar SOP pelayanan prima.`, analogi_hotel:`Satu SOP salah, rating OTA bisa turun.`, tips:`Hafal: OI OC OD OOO OOS, LARK, CICO` };
  }
  if(mapel==="inggris"){
    const cases = [
      {q:"Guest: 'My AC is not working.' Best FO response?", o:["Let me check it for you right away, I apologize for the inconvenience.","Not my job.","Wait.","No AC today."], k:0, top:"Handling Complaint"},
      {q:"We ___ the room since morning. (present perfect)", o:["have cleaned","cleaned","are cleaning","will clean"], k:0, top:"Grammar"},
      {q:"'Overbooking' means?", o:["More bookings than rooms available","No booking","Free room","Late check-out"], k:0, top:"Vocabulary"},
      {q:"Which is offering help?", o:["May I help you with your luggage?","Go away.","No help.","I busy."], k:0, top:"Offering Help"},
    ];
    const c = pick(idx, cases);
    return { id: genID(mapel,idx), mapel, level:"mudah", topik:c.top, pertanyaan:c.q, opsi:c.o, kunci:c.k, penjelasan_benar:`Jawaban ${c.o[c.k]} benar karena sopan, empathy, dan offer solution. Ini standar hospitality English.`, kenapa_salah:`Pilihan lain terlalu kasar atau grammar salah.`, analogi_hotel:`Bayangkan hadapi bule komplain, harus LARK.`, tips:`Hafal phrase: Let me..., I apologize..., Would you like...?` };
  }
  // indonesia
  const indo = [
    {q:`Bacalah: "Pelayanan prima adalah kunci utama perhotelan. Tamu puas akan kembali." Ide pokoknya adalah...`, o:["Pelayanan prima membuat tamu kembali","Hotel harus besar","Tamu selalu marah","Harga mahal"], k:0, top:"Ide Pokok"},
    {q:`Kalimat "Pelayanan hotel bagaikan mentari pagi" mengandung majas...`, o:["Simile","Personifikasi","Hiperbola","Metafora"], k:0, top:"Majas"},
    {q:`Manakah penulisan EYD yang benar untuk laporan?`, o:["Check-in tamu dilaksanakan pukul 14.00 WIB.","check in tamu di laksanakan pukul 14:00 WIB","Check in tamu dilaksanakan pukul 14.00 WIB.","Check-in Tamu Dilaksanakan Pukul 14.00 WIB"], k:0, top:"EYD"},
  ];
  const c = pick(idx, indo);
  return { id: genID(mapel,idx), mapel, level: pick(idx,["mudah","sedang"] as any), topik:c.top, pertanyaan:c.q, opsi:c.o, kunci:c.k, penjelasan_benar:`Jawaban ${c.o[c.k]} benar sesuai definisi ${c.top}. Penting untuk SOP dan komunikasi FO.`, kenapa_salah:`Pilihan lain tidak mencakup makna utama atau tidak sesuai EYD.`, analogi_hotel:`Kalau ${c.top} berantakan, tamu bingung baca petunjuk.`, tips:`Cari kata diulang untuk ide pokok, check-in pakai strip.` };
}
export function getTotalCounts(){ return { indonesia:250, matematika:250, inggris:250, perhotelan:250, total:1000 }; }

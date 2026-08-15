export type Mapel = "indonesia" | "matematika" | "inggris" | "perhotelan" | "all";
export interface Question {
  id: string; mapel: Mapel; level: "mudah"|"sedang"|"sulit"|"hoti"; pertanyaan: string; opsi: string[]; kunci: number;
  penjelasan_benar: string; kenapa_salah: string; analogi_hotel: string; tips: string; topik: string;
}

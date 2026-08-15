import { NextResponse } from "next/server";
import { redis, isRedisReady } from "@/lib/redis";
import { generateQuestions } from "@/lib/questionGenerator";
export const dynamic = "force-dynamic";
export async function POST(){
  if(!isRedisReady()) return NextResponse.json({ error:"Redis not configured" }, {status:400});
  const all = generateQuestions("all", 800, 0);
  await redis.set("seed:questions:800", all);
  return NextResponse.json({ seeded:true, total:all.length });
}
export async function GET(){ return POST(); }

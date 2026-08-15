import { NextRequest, NextResponse } from "next/server";
import { redis, isRedisReady } from "@/lib/redis";
export const dynamic = "force-dynamic";
export async function POST(req: NextRequest){
  try{
    const body = await req.json();
    const { userId, xp, mapel, isCorrect, questionId } = body;
    if(!userId) return NextResponse.json({ error:"userId required" }, {status:400});
    if(!isRedisReady()) return NextResponse.json({ saved:false, mode:"mock", xp: xp||0 });
    const userKey = `user:${userId}`;
    const existing:any = await redis.hgetall(userKey) || {};
    const newXp = (parseInt(existing.xp||"0") + (xp||0));
    const totalAnswered = parseInt(existing.totalAnswered||"0")+1;
    const totalCorrect = parseInt(existing.totalCorrect||"0") + (isCorrect?1:0);
    const last = existing.lastActive ? parseInt(existing.lastActive) : 0;
    const isSameDay = last ? new Date().toDateString()===new Date(last).toDateString() : false;
    const streak = last ? (isSameDay ? parseInt(existing.streak||"1") : parseInt(existing.streak||"1")+1) : 1;
    await redis.hset(userKey, { xp:newXp, level:Math.floor(newXp/200)+1, totalAnswered, totalCorrect, streak, lastActive:Date.now(), [`mapel_${mapel}_answered`]: (parseInt(existing[`mapel_${mapel}_answered`]||"0")+1) });
    await redis.zadd("leaderboard", { score:newXp, member:userId });
    await redis.lpush(`history:${userId}`, JSON.stringify({ questionId, mapel, isCorrect, at:Date.now() }));
    await redis.ltrim(`history:${userId}`,0,99);
    return NextResponse.json({ saved:true, xp:newXp, level:Math.floor(newXp/200)+1, streak });
  }catch(e:any){ return NextResponse.json({ error:e.message }, {status:500}); }
}
export async function GET(req: NextRequest){
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if(!userId) return NextResponse.json({ error:"userId required" }, {status:400});
  if(!isRedisReady()) return NextResponse.json({ mode:"mock", xp:0 });
  const data = await redis.hgetall(`user:${userId}`);
  return NextResponse.json({ data });
}

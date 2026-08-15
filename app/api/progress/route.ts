import { NextRequest, NextResponse } from "next/server";
import { redis, isRedisReady } from "@/lib/redis";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest){
  try{
    const body = await req.json();
    const { userId, xp, mapel, correct, isCorrect, questionId } = body;
    if(!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

    if(!isRedisReady()){
      // fallback tanpa redis
      return NextResponse.json({ saved: false, mode: "mock", message: "Redis not configured, progress saved locally only" });
    }

    const userKey = `user:${userId}`;
    const now = Date.now();

    // Get existing
    const existing: any = await redis.hgetall(userKey) || {};
    const newXp = (parseInt(existing.xp||"0") + (xp||0));
    const totalAnswered = parseInt(existing.totalAnswered||"0") + 1;
    const totalCorrect = parseInt(existing.totalCorrect||"0") + (isCorrect?1:0);
    const streak = existing.lastActive ? (new Date().toDateString()===new Date(parseInt(existing.lastActive)).toDateString() ? parseInt(existing.streak||"0") : parseInt(existing.streak||"0")+1) : 1;

    await redis.hset(userKey, {
      xp: newXp,
      level: Math.floor(newXp/200)+1,
      totalAnswered,
      totalCorrect,
      streak,
      lastActive: now,
      [`mapel_${mapel}_answered`]: (parseInt(existing[`mapel_${mapel}_answered`]||"0")+1),
      [`mapel_${mapel}_correct`]: (parseInt(existing[`mapel_${mapel}_correct`]||"0") + (isCorrect?1:0)),
    });

    // Leaderboard
    await redis.zadd("leaderboard", { score: newXp, member: userId });
    // History
    await redis.lpush(`history:${userId}`, JSON.stringify({ questionId, mapel, correct, isCorrect, at: now }));
    await redis.ltrim(`history:${userId}`, 0, 99);

    return NextResponse.json({ saved: true, xp: newXp, level: Math.floor(newXp/200)+1, streak, totalAnswered, totalCorrect });
  } catch(e:any){
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest){
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if(!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
  if(!isRedisReady()) return NextResponse.json({ mode:"mock", xp:0 });
  const data = await redis.hgetall(`user:${userId}`);
  const history = await redis.lrange(`history:${userId}`, 0, 20);
  return NextResponse.json({ data, history: history.map((h:any)=>JSON.parse(h)) });
}

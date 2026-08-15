import { NextResponse } from "next/server";
import { redis, isRedisReady } from "@/lib/redis";
export const dynamic = "force-dynamic";
export async function GET(){
  if(!isRedisReady()) return NextResponse.json({ leaderboard:[], mode:"mock" });
  const top = await redis.zrange("leaderboard",0,9,{rev:true, withScores:true});
  const list=[] as any[];
  for(let i=0;i<top.length;i+=2){
    const member = top[i] as string;
    const score = top[i+1] as number;
    const user = await redis.hgetall(`user:${member}`);
    list.push({ userId:member, xp:score, level:user?.level||1 });
  }
  return NextResponse.json({ leaderboard:list });
}

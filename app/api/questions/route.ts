import { NextRequest, NextResponse } from "next/server";
import { generateQuestions } from "@/lib/questionGenerator";
import { redis, isRedisReady } from "@/lib/redis";
import { Mapel } from "@/lib/types";
export const dynamic = "force-dynamic";
export async function GET(req: NextRequest){
  const { searchParams } = new URL(req.url);
  const mapel = (searchParams.get("mapel") as Mapel) || "all";
  const limit = parseInt(searchParams.get("limit") || "50");
  const offset = parseInt(searchParams.get("offset") || "0");
  try{
    if(isRedisReady()){
      const key = `questions:${mapel}:${limit}:${offset}`;
      const cached = await redis.get(key);
      if(cached) return NextResponse.json({ source:"redis-cache", mapel, data: cached });
    }
    const data = generateQuestions(mapel, Math.min(limit,250), offset);
    if(isRedisReady()){
      const key = `questions:${mapel}:${limit}:${offset}`;
      await redis.set(key, data, { ex: 3600 });
    }
    return NextResponse.json({ source:"generator-api", mapel, total:1000, data });
  }catch(e:any){ return NextResponse.json({ error:e.message }, {status:500}); }
}

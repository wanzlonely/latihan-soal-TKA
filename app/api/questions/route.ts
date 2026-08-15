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

  try {
    // Coba ambil dari Redis cache dulu
    if(isRedisReady()){
      const cacheKey = `questions:${mapel}:${limit}:${offset}`;
      const cached = await redis.get(cacheKey);
      if(cached) return NextResponse.json({ source: "redis-cache", data: cached, total: 1000 });
    }

    const questions = generateQuestions(mapel, Math.min(limit, 250), offset);

    // Simpan ke Redis cache 1 jam
    if(isRedisReady()){
      const cacheKey = `questions:${mapel}:${limit}:${offset}`;
      await redis.set(cacheKey, questions, { ex: 3600 });
    }

    return NextResponse.json({ source: "generator-api", mapel, limit, offset, total: 1000, data: questions });
  } catch(e:any){
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

import { Podcast } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const res = await fetch(`${process.env.BASE_BACKEND}/podcasts/favorite`);

  const data: Podcast[] = await res.json();

  return NextResponse.json({ data: data }, { status: res.status });
}

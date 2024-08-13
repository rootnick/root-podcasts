import { Podcast } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const search = url.searchParams.get("s");

  const baseUrl = `${process.env.BASE_BACKEND}/podcasts`;
  let res;

  if (search) {
    res = await fetch(`${baseUrl}/search?s=${search}`);
  } else {
    res = await fetch(`${baseUrl}?${url.searchParams}`);
  }

  const data: Podcast[] = await res.json();

  return NextResponse.json(data, { status: res.status });
}

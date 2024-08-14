import { Dictonary } from "@/types";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const [countriesResponse, topicsResponse] = await Promise.all([
    fetch(`${process.env.BASE_BACKEND}/countries`),
    fetch(`${process.env.BASE_BACKEND}/topics`),
  ]);

  const [countries, topics] = [
    await countriesResponse.json(),
    await topicsResponse.json(),
  ] satisfies [Dictonary[], Dictonary[]];

  return NextResponse.json({ countries, topics });
}

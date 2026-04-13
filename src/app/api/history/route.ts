export const runtime = "nodejs";

import { NextResponse } from "next/server";

import { getRecentAnalyses } from "@/lib/db";

export async function GET() {
  try {
    const runs = await getRecentAnalyses();
    return NextResponse.json({ runs });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to load recent analyses."
      },
      { status: 500 }
    );
  }
}

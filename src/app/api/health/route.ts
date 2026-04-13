import { NextResponse } from "next/server";

import { getPool } from "@/lib/db";

export async function GET() {
  try {
    // Check database connection
    const pool = getPool();
    await pool.query("SELECT 1");

    return NextResponse.json({
      status: "healthy",
      database: "connected",
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || "0.1.0"
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      {
        status: "unhealthy",
        database: "disconnected",
        error: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: 503 }
    );
  }
}

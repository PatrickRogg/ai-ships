import { NextRequest, NextResponse } from "next/server";

/**
 * Verifies that a request is from a legitimate Vercel cron job
 * by checking the Authorization header against the CRON_SECRET environment variable
 */
export function verifyCronAuth(request: NextRequest): NextResponse | null {
  if (process.env.NODE_ENV === "development") {
    return null;
  }

  const cronSecret = process.env.CRON_SECRET;
  
  if (!cronSecret) {
    console.error("CRON_SECRET environment variable is not set");
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  const authHeader = request.headers.get("authorization");
  
  if (!authHeader) {
    console.error("Missing Authorization header for cron job");
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Vercel sends the CRON_SECRET as a Bearer token
  const expectedAuth = `Bearer ${cronSecret}`;
  
  if (authHeader !== expectedAuth) {
    console.error("Invalid cron secret in Authorization header");
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Authentication successful
  return null;
}
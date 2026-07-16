import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ marketId: string }> },
) {
  const backendUrl = process.env.MOM3_BACKEND_URL || process.env.NEXT_PUBLIC_MOM3_BACKEND_URL;

  if (!backendUrl) {
    return NextResponse.json(
      { error: "Live execution requires MOM3_BACKEND_URL.", marketId: null, allowlisted: false, policy: null },
      { status: 503 },
    );
  }

  const { marketId } = await params;

  try {
    const response = await fetch(
      `${backendUrl}/api/execution/markets/${encodeURIComponent(marketId)}`,
      { cache: "no-store" },
    );
    const payload = await response.json().catch(() => ({
      error: "Invalid execution market response.",
      marketId,
      allowlisted: false,
      policy: null,
    }));
    return NextResponse.json(payload, { status: response.status });
  } catch (error) {
    console.error("Execution market detail proxy failed", error);
    return NextResponse.json(
      {
        error: "The execution market detail is temporarily unavailable.",
        marketId,
        allowlisted: false,
        policy: null,
      },
      { status: 502 },
    );
  }
}

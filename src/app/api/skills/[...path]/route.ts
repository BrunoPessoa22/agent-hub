import { NextRequest, NextResponse } from "next/server";

const API = (process.env.ACP_API_URL || "https://api-production-5903e.up.railway.app").replace(/\/$/, "");
const SECRET = (process.env.ACP_ADMIN_SECRET || "").trim();

async function forward(req: NextRequest, path: string[]) {
  const url = new URL(`/api/skills/${path.join("/")}`, API);
  req.nextUrl.searchParams.forEach((value, key) => url.searchParams.set(key, value));

  const headers: Record<string, string> = { Authorization: `Bearer ${SECRET}` };
  const body = req.method === "GET" ? undefined : await req.text();
  if (body) headers["Content-Type"] = "application/json";

  const res = await fetch(url, { method: req.method, headers, body, cache: "no-store" });
  const data = await res.text();
  return new NextResponse(data, {
    status: res.status,
    headers: { "Content-Type": res.headers.get("content-type") || "application/json" },
  });
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return forward(req, path);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return forward(req, path);
}

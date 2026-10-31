import { NextRequest, NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/auth/admin";


export async function GET(request: NextRequest) {
  const admin = await requireAdminFromRequest(request, { checkRevoked: false });

  return NextResponse.json(
    { admin: Boolean(admin) },
    { headers: { "Cache-Control": "no-store" } },
  );
}
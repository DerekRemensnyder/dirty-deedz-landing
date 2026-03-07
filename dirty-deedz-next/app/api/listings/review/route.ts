import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../lib/supabase";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const action = searchParams.get("action");
  const token = searchParams.get("token");

  /* ── Validate ── */
  if (token !== process.env.REVIEW_SECRET) {
    return new NextResponse(page("Unauthorized", "This link is not valid.", "red"), {
      status: 401,
      headers: { "Content-Type": "text/html" },
    });
  }

  if (!id || !action || !["approve", "reject"].includes(action)) {
    return new NextResponse(page("Invalid Request", "Missing or invalid parameters.", "red"), {
      status: 400,
      headers: { "Content-Type": "text/html" },
    });
  }

  const sb = supabaseAdmin();

  /* ── Check current status ── */
  const { data: listing, error: fetchError } = await sb
    .from("listings")
    .select("name, business_name, address, status")
    .eq("id", id)
    .single();

  if (fetchError || !listing) {
    return new NextResponse(page("Not Found", "Property owner application not found.", "red"), {
      status: 404,
      headers: { "Content-Type": "text/html" },
    });
  }

  if (listing.status === "verified" || listing.status === "rejected") {
    const already = listing.status === "verified" ? "approved" : "rejected";
    return new NextResponse(
      page(
        "Already Reviewed",
        `${listing.name} (${listing.address}) was already <strong>${already}</strong> by another reviewer.`,
        "#555"
      ),
      { status: 200, headers: { "Content-Type": "text/html" } }
    );
  }

  /* ── Update status ── */
  const newStatus = action === "approve" ? "verified" : "rejected";
  const { error: updateError } = await sb
    .from("listings")
    .update({ status: newStatus })
    .eq("id", id);

  if (updateError) {
    return new NextResponse(page("Error", "Failed to update status. Try again.", "red"), {
      status: 500,
      headers: { "Content-Type": "text/html" },
    });
  }

  const color = action === "approve" ? "#22c55e" : "#ef4444";
  const emoji = action === "approve" ? "✅" : "❌";
  const verb = action === "approve" ? "Approved" : "Rejected";

  return new NextResponse(
    page(
      `${emoji} ${verb}`,
      `<strong>${listing.name}</strong> (${listing.address}) has been <strong>${verb.toLowerCase()}</strong>.${
        action === "approve"
          ? "<br><br>Their property listing is now active and they will be notified."
          : "<br><br>Their application has been declined."
      }`,
      color
    ),
    { status: 200, headers: { "Content-Type": "text/html" } }
  );
}

/* ── Simple HTML response page ── */
function page(title: string, message: string, color: string) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} — Dirty Deedz</title></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0;background:#f5f5f5;">
  <div style="background:#fff;padding:48px;border-radius:16px;box-shadow:0 4px 24px rgba(0,0,0,.1);text-align:center;max-width:480px;">
    <h1 style="color:${color};margin:0 0 16px 0;font-size:28px;">${title}</h1>
    <p style="color:#333;font-size:16px;line-height:1.6;">${message}</p>
    <p style="color:#999;font-size:13px;margin-top:24px;">Dirty Deedz Property Owner Review</p>
  </div>
</body>
</html>`;
}

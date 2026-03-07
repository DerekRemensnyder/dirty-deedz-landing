import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabase";
import { sendReviewEmail } from "../../../lib/email";

export async function POST(req: Request) {
  try {
    const fd = await req.formData();

    const name = fd.get("name") as string | null;
    const email = fd.get("email") as string | null;
    const phone = fd.get("phone") as string | null;
    const companyName = fd.get("companyName") as string | null;
    const serviceZips = fd.getAll("serviceZips") as string[];
    const signature = fd.get("signature") as string | null;

    /* ── Validate required fields ── */
    if (!name || !email || !phone || !companyName || serviceZips.length === 0 || !signature) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const sb = supabaseAdmin();

    /* ── Upload files to Storage ── */
    const uploadFile = async (field: string): Promise<string | null> => {
      const file = fd.get(field) as File | null;
      if (!file || file.size === 0) return null;

      const ext = file.name.split(".").pop() ?? "bin";
      const path = `${email}/${field}-${Date.now()}.${ext}`;
      const buf = Buffer.from(await file.arrayBuffer());

      const { error } = await sb.storage
        .from("contractor-docs")
        .upload(path, buf, { contentType: file.type, upsert: true });

      if (error) throw new Error(`Upload failed (${field}): ${error.message}`);

      const { data: urlData } = sb.storage
        .from("contractor-docs")
        .getPublicUrl(path);

      return urlData.publicUrl;
    };

    const [businessLicenseUrl, coiUrl, governmentIdUrl] = await Promise.all([
      uploadFile("businessLicense"),
      uploadFile("coi"),
      uploadFile("governmentId"),
    ]);

    /* ── Insert contractor row ── */
    const { error: insertError } = await sb.from("contractors").insert({
      name,
      email,
      phone,
      company_name: companyName,
      service_zips: serviceZips,
      signature,
      signed_at: new Date().toISOString(),
      business_license_url: businessLicenseUrl,
      coi_url: coiUrl,
      government_id_url: governmentIdUrl,
    });

    if (insertError) {
      /* Unique constraint on email */
      if (insertError.code === "23505") {
        return NextResponse.json(
          { error: "An application with this email already exists." },
          { status: 409 }
        );
      }
      throw insertError;
    }

    /* ── Get the new row's ID for the review email ── */
    const { data: row } = await sb
      .from("contractors")
      .select("id")
      .eq("email", email)
      .single();

    /* ── Send review email ── */
    if (row) {
      console.log(">>> Sending review email for contractor:", row.id);
      try {
        await sendReviewEmail({
          id: row.id,
          name,
          email,
          phone,
          companyName,
          serviceZips,
          businessLicenseUrl: businessLicenseUrl,
          coiUrl: coiUrl,
          governmentIdUrl: governmentIdUrl,
        });
        console.log(">>> Review email sent successfully");
      } catch (emailErr) {
        console.error(">>> Review email FAILED:", emailErr);
      }
    } else {
      console.error(">>> Could not find contractor row to send email");
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Contractor application error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

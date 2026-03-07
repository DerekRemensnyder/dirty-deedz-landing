import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabase";
import { sendListingReviewEmail } from "../../../lib/email";

export async function POST(req: Request) {
  try {
    const fd = await req.formData();

    const name = fd.get("name") as string | null;
    const email = fd.get("email") as string | null;
    const phone = fd.get("phone") as string | null;
    const businessName = fd.get("businessName") as string | null;
    const address = fd.get("address") as string | null;
    const neighborhood = fd.get("neighborhood") as string | null;
    const parcelCount = fd.get("parcelCount") as string | null;
    const notes = fd.get("notes") as string | null;
    const registeredName = fd.get("registeredName") as string | null;
    const ein = fd.get("ein") as string | null;
    const signature = fd.get("signature") as string | null;

    /* ── Validate required fields ── */
    if (!name || !email || !address || !registeredName || !signature) {
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
        .from("listing-docs")
        .upload(path, buf, { contentType: file.type, upsert: true });

      if (error) throw new Error(`Upload failed (${field}): ${error.message}`);

      const { data: urlData } = sb.storage
        .from("listing-docs")
        .getPublicUrl(path);

      return urlData.publicUrl;
    };

    const [sidewalkPhotoUrl, idDocumentUrl, deedUrl] = await Promise.all([
      uploadFile("sidewalkPhoto"),
      uploadFile("idDocument"),
      uploadFile("deed"),
    ]);

    /* ── Insert listing row ── */
    const { error: insertError } = await sb.from("listings").insert({
      name,
      email,
      phone,
      business_name: businessName,
      address,
      neighborhood,
      parcel_count: parcelCount || "1",
      notes,
      registered_name: registeredName,
      ein,
      signature,
      signed_at: new Date().toISOString(),
      sidewalk_photo_url: sidewalkPhotoUrl,
      id_document_url: idDocumentUrl,
      deed_url: deedUrl,
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
      .from("listings")
      .select("id")
      .eq("email", email)
      .single();

    /* ── Send review email ── */
    if (row) {
      console.log(">>> Sending review email for listing:", row.id);
      try {
        await sendListingReviewEmail({
          id: row.id,
          name,
          email,
          phone: phone || "",
          businessName: businessName || "",
          address,
          parcelCount: parcelCount || "1",
          sidewalkPhotoUrl,
          idDocumentUrl,
          deedUrl,
        });
        console.log(">>> Review email sent successfully");
      } catch (emailErr) {
        console.error(">>> Review email FAILED:", emailErr);
      }
    } else {
      console.error(">>> Could not find listing row to send email");
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Listing application error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

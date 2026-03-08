import { Resend } from "resend";

// Lazy-init: instantiate at call time so a missing env var doesn't crash the build
const getResend = () => new Resend(process.env.RESEND_API_KEY);

const reviewers = (process.env.REVIEWER_EMAILS ?? "").split(",").map((e) => e.trim()).filter(Boolean);

interface ContractorInfo {
  id: string;
  name: string;
  email: string;
  phone: string;
  companyName: string;
  serviceZips: string[];
  businessLicenseUrl: string | null;
  coiUrl: string | null;
  governmentIdUrl: string | null;
}

export async function sendReviewEmail(contractor: ContractorInfo) {
  if (reviewers.length === 0) {
    console.warn("No REVIEWER_EMAILS configured — skipping review email");
    return;
  }

  const secret = process.env.REVIEW_SECRET;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dirtydeedz.com";

  const approveUrl = `${baseUrl}/api/contractors/review?id=${contractor.id}&action=approve&token=${secret}`;
  const rejectUrl = `${baseUrl}/api/contractors/review?id=${contractor.id}&action=reject&token=${secret}`;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #1a1a2e; color: #fff; padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">🧹 New Contractor Application</h1>
      </div>

      <div style="background: #f8f8f8; padding: 24px; border: 1px solid #e0e0e0;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555; width: 120px;">Name</td>
            <td style="padding: 8px 0;">${contractor.name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555;">Company</td>
            <td style="padding: 8px 0;">${contractor.companyName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555;">Email</td>
            <td style="padding: 8px 0;"><a href="mailto:${contractor.email}">${contractor.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555;">Phone</td>
            <td style="padding: 8px 0;"><a href="tel:${contractor.phone}">${contractor.phone}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555;">Service Zips</td>
            <td style="padding: 8px 0;">${contractor.serviceZips.join(", ")}</td>
          </tr>
        </table>
      </div>

      <div style="background: #fff; padding: 24px; border: 1px solid #e0e0e0; border-top: none;">
        <h3 style="margin: 0 0 12px 0; color: #333;">Uploaded Documents</h3>
        <p style="margin: 4px 0;">${contractor.businessLicenseUrl ? `<a href="${contractor.businessLicenseUrl}" style="color: #2563eb;">📄 View Business License</a>` : "❌ No business license uploaded"}</p>
        <p style="margin: 4px 0;">${contractor.coiUrl ? `<a href="${contractor.coiUrl}" style="color: #2563eb;">📄 View Certificate of Insurance</a>` : "❌ No COI uploaded"}</p>
        <p style="margin: 4px 0;">${contractor.governmentIdUrl ? `<a href="${contractor.governmentIdUrl}" style="color: #2563eb;">📄 View Government ID</a>` : "❌ No government ID uploaded"}</p>
      </div>

      <div style="padding: 24px; text-align: center; background: #fff; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 12px 12px;">
        <p style="margin: 0 0 16px 0; color: #555;">Review the documents above, then approve or reject:</p>
        <a href="${approveUrl}" style="display: inline-block; background: #22c55e; color: #fff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; margin: 0 8px;">✅ APPROVE</a>
        <a href="${rejectUrl}" style="display: inline-block; background: #ef4444; color: #fff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; margin: 0 8px;">❌ REJECT</a>
      </div>
    </div>
  `;

  const result = await getResend().emails.send({
    from: "Dirty Deedz <onboarding@resend.dev>",
    to: reviewers,
    subject: `New Contractor Application — ${contractor.name} (${contractor.companyName})`,
    html,
  });

  console.log(">>> Resend API response:", JSON.stringify(result));
}

/* ── Property Owner Listing Review Email ── */

interface ListingInfo {
  id: string;
  name: string;
  email: string;
  phone: string;
  businessName: string;
  address: string;
  parcelCount: string;
  sidewalkPhotoUrl: string | null;
  idDocumentUrl: string | null;
  deedUrl: string | null;
}

export async function sendListingReviewEmail(listing: ListingInfo) {
  if (reviewers.length === 0) {
    console.warn("No REVIEWER_EMAILS configured — skipping review email");
    return;
  }

  const secret = process.env.REVIEW_SECRET;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dirtydeedz.com";

  const approveUrl = `${baseUrl}/api/listings/review?id=${listing.id}&action=approve&token=${secret}`;
  const rejectUrl = `${baseUrl}/api/listings/review?id=${listing.id}&action=reject&token=${secret}`;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #1a1a2e; color: #fff; padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">🏠 New Property Owner Application</h1>
      </div>

      <div style="background: #f8f8f8; padding: 24px; border: 1px solid #e0e0e0;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555; width: 120px;">Name</td>
            <td style="padding: 8px 0;">${listing.name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555;">Address</td>
            <td style="padding: 8px 0;">${listing.address}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555;">Business</td>
            <td style="padding: 8px 0;">${listing.businessName || "—"}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555;">Parcels</td>
            <td style="padding: 8px 0;">${listing.parcelCount}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555;">Email</td>
            <td style="padding: 8px 0;"><a href="mailto:${listing.email}">${listing.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555;">Phone</td>
            <td style="padding: 8px 0;">${listing.phone ? `<a href="tel:${listing.phone}">${listing.phone}</a>` : "—"}</td>
          </tr>
        </table>
      </div>

      <div style="background: #fff; padding: 24px; border: 1px solid #e0e0e0; border-top: none;">
        <h3 style="margin: 0 0 12px 0; color: #333;">Uploaded Documents</h3>
        <p style="margin: 4px 0;">${listing.sidewalkPhotoUrl ? `<a href="${listing.sidewalkPhotoUrl}" style="color: #2563eb;">📸 View Sidewalk Photo</a>` : "❌ No sidewalk photo uploaded"}</p>
        <p style="margin: 4px 0;">${listing.idDocumentUrl ? `<a href="${listing.idDocumentUrl}" style="color: #2563eb;">📄 View Business / Government ID</a>` : "❌ No ID uploaded"}</p>
        <p style="margin: 4px 0;">${listing.deedUrl ? `<a href="${listing.deedUrl}" style="color: #2563eb;">📄 View Property Deed</a>` : "❌ No deed uploaded"}</p>
      </div>

      <div style="padding: 24px; text-align: center; background: #fff; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 12px 12px;">
        <p style="margin: 0 0 16px 0; color: #555;">Review the documents above, then approve or reject:</p>
        <a href="${approveUrl}" style="display: inline-block; background: #22c55e; color: #fff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; margin: 0 8px;">✅ APPROVE</a>
        <a href="${rejectUrl}" style="display: inline-block; background: #ef4444; color: #fff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; margin: 0 8px;">❌ REJECT</a>
      </div>
    </div>
  `;

  const result = await getResend().emails.send({
    from: "Dirty Deedz <onboarding@resend.dev>",
    to: reviewers,
    subject: `New Property Listing — ${listing.name} (${listing.address})`,
    html,
  });

  console.log(">>> Resend API response:", JSON.stringify(result));
}

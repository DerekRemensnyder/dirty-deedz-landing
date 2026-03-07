"use client";

import { useState, useRef } from "react";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";

const STEPS = ["Property Details", "Review & Sign", "Verify Ownership"];

export default function ListPage() {
  const photoRef = useRef<HTMLInputElement>(null);
  const idRef = useRef<HTMLInputElement>(null);
  const deedRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [photos, setPhotos] = useState<{ id: string; dataUrl: string; file: File }[]>([]);
  const [primaryPhotoId, setPrimaryPhotoId] = useState<string | null>(null);
  const [idPreview, setIdPreview] = useState<string | null>(null);
  const [deedPreview, setDeedPreview] = useState<string | null>(null);
  const [signature, setSignature] = useState("");
  const [signedDate] = useState(() =>
    new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  );

  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", businessName: "",
    address: "", neighborhood: "", parcelCount: "1", notes: "",
    registeredName: "", ein: "",
  });

  const filePreview = (file: File, setter: (s: string) => void) => {
    const r = new FileReader();
    r.onload = () => setter(r.result as string);
    r.readAsDataURL(file);
  };

  const handlePhotoAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const id = Math.random().toString(36).slice(2);
      const reader = new FileReader();
      reader.onload = () => {
        setPhotos((prev) => {
          const updated = [...prev, { id, dataUrl: reader.result as string, file }];
          if (prev.length === 0) setPrimaryPhotoId(id);
          return updated;
        });
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);

    try {
      const fd = new FormData();
      fd.append("name", formData.name);
      fd.append("email", formData.email);
      fd.append("phone", formData.phone);
      fd.append("businessName", formData.businessName);
      fd.append("address", formData.address);
      fd.append("neighborhood", formData.neighborhood);
      fd.append("parcelCount", formData.parcelCount);
      fd.append("notes", formData.notes);
      fd.append("registeredName", formData.registeredName);
      fd.append("ein", formData.ein);
      fd.append("signature", signature);

      // Attach the primary photo (or first photo) as sidewalkPhoto
      const primaryPhoto = photos.find((p) => p.id === primaryPhotoId) || photos[0];
      if (primaryPhoto) fd.append("sidewalkPhoto", primaryPhoto.file);

      const idFile = idRef.current?.files?.[0];
      if (idFile) fd.append("idDocument", idFile);
      const deedFile = deedRef.current?.files?.[0];
      if (deedFile) fd.append("deed", deedFile);

      const res = await fetch("/api/listings", { method: "POST", body: fd });
      const data = await res.json();

      if (!res.ok) {
        setSubmitError(data.error || "Something went wrong. Please try again.");
        return;
      }

      setSubmitted(true);
    } catch {
      setSubmitError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const removePhoto = (id: string) => {
    setPhotos((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      if (primaryPhotoId === id) setPrimaryPhotoId(updated[0]?.id ?? null);
      return updated;
    });
  };

  const movePhoto = (id: string, dir: -1 | 1) => {
    setPhotos((prev) => {
      const idx = prev.findIndex((p) => p.id === id);
      if (idx < 0) return prev;
      const next = idx + dir;
      if (next < 0 || next >= prev.length) return prev;
      const arr = [...prev];
      [arr[idx], arr[next]] = [arr[next], arr[idx]];
      return arr;
    });
  };

  const step1Valid = formData.name.trim() && formData.email.trim() && formData.address.trim();
  const step2Valid = signature.trim().length > 2;
  const step3Valid = formData.registeredName.trim() && (idPreview || deedPreview);

  if (submitted) {
    return (
      <div className="lp-page">
        <Nav />
        <div className="lp-success">
          <div className="lp-success-icon">✓</div>
          <span className="section-label">Application Received</span>
          <h1>You&rsquo;re on your way.</h1>
          <p>
            Your listing for <strong>{formData.address}</strong> is under review.
            We&rsquo;ll verify your ownership documents and reach out within 48–72 hours
            with next steps.
          </p>
          <div className="lp-success-actions">
            <a href="/" className="btn btn-primary">Back to Home <span className="arrow">→</span></a>
            <a href="/map" className="lp-success-link">Browse Available Deedz</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lp-page">
      <Nav />

      {/* Hero */}
      <div className="lp-hero">
        <span className="section-label">Property Owners</span>
        <h1>List Your Deedz</h1>
        <p>Register your sidewalk parcels and start earning passive ad revenue. Takes about 5 minutes.</p>
      </div>

      {/* Step bar */}
      <div className="lp-step-bar">
        <div className="lp-step-bar-inner">
          {STEPS.map((label, i) => (
            <div key={label} className={`lp-step${step === i + 1 ? " active" : step > i + 1 ? " done" : ""}`}>
              <span className="lp-step-num">{step > i + 1 ? "✓" : i + 1}</span>
              <span className="lp-step-label">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Form body */}
      <div className="lp-body">

        {/* ── Step 1: Property Details ── */}
        {step === 1 && (
          <div className="lp-form-section">
            <div className="lp-field-group">
              <h3 className="lp-section-title">Property Photos</h3>

              {/* Tip callout */}
              <div className="lp-photo-tip">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <p>
                  <strong>What makes a great feature image:</strong> Show the full sidewalk surface with clear visibility of its width and length. Include surrounding context — busy storefronts, foot traffic, street intersections, or nearby landmarks. Well-lit daytime shots get significantly more advertiser interest. Drag to reorder; tap <strong>★ Set Primary</strong> to choose the image advertisers see first.
                </p>
              </div>

              {/* Photo strip */}
              <div className="lp-photo-strip">
                {photos.map((photo, idx) => (
                  <div
                    key={photo.id}
                    className={`lp-photo-card${primaryPhotoId === photo.id ? " primary" : ""}`}
                  >
                    <img src={photo.dataUrl} alt={`Property photo ${idx + 1}`} className="lp-photo-img" />

                    {/* Always-visible: primary badge + remove */}
                    {primaryPhotoId === photo.id && (
                      <div className="lp-photo-badge">★ Primary</div>
                    )}
                    <button
                      type="button"
                      className="lp-photo-remove"
                      onClick={() => removePhoto(photo.id)}
                      aria-label="Remove photo"
                    >×</button>

                    {/* Hover overlay: set primary + reorder */}
                    <div className="lp-photo-overlay">
                      {primaryPhotoId !== photo.id && (
                        <button
                          type="button"
                          className="lp-photo-set-primary"
                          onClick={() => setPrimaryPhotoId(photo.id)}
                        >★ Set Primary</button>
                      )}
                      <div className="lp-photo-reorder">
                        <button type="button" onClick={() => movePhoto(photo.id, -1)} disabled={idx === 0} aria-label="Move left">←</button>
                        <button type="button" onClick={() => movePhoto(photo.id, 1)} disabled={idx === photos.length - 1} aria-label="Move right">→</button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add photos button */}
                <div className="lp-photo-add" onClick={() => photoRef.current?.click()}>
                  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                    <line x1="19" y1="3" x2="19" y2="9"/><line x1="16" y1="6" x2="22" y2="6"/>
                  </svg>
                  <span>{photos.length === 0 ? "Add Photos" : "Add More"}</span>
                  <small>JPG or PNG · 16:9 · up to 10MB each</small>
                </div>
              </div>

              <input
                ref={photoRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoAdd}
                style={{ display: "none" }}
              />
            </div>

            <div className="lp-field-group">
              <h3 className="lp-section-title">Property Address</h3>
              <input className="lp-input" type="text" placeholder="Street Address *" required
                value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
              <input className="lp-input" type="text" placeholder="Neighborhood (optional)"
                value={formData.neighborhood} onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })} />
            </div>

            <div className="lp-field-group">
              <h3 className="lp-section-title">Number of Sidewalk Parcels</h3>
              <p className="lp-hint">Each slab of sidewalk = one parcel.</p>
              <div className="lp-pill-row">
                {["1", "2", "3", "4+"].map((n) => (
                  <button key={n} type="button"
                    className={`lp-pill${formData.parcelCount === n ? " active" : ""}`}
                    onClick={() => setFormData({ ...formData, parcelCount: n })}>
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div className="lp-field-group">
              <h3 className="lp-section-title">Your Details</h3>
              <div className="lp-input-row">
                <input className="lp-input" type="text" placeholder="Full Name *" required
                  value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                <input className="lp-input" type="email" placeholder="Email *" required
                  value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              </div>
              <div className="lp-input-row">
                <input className="lp-input" type="tel" placeholder="Phone"
                  value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                <input className="lp-input" type="text" placeholder="Business Name (optional)"
                  value={formData.businessName} onChange={(e) => setFormData({ ...formData, businessName: e.target.value })} />
              </div>
              <textarea className="lp-textarea" placeholder="Anything else we should know about your property..." rows={3}
                value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
            </div>

            <div className="lp-actions">
              <button className="btn btn-primary lp-cta" disabled={!step1Valid} onClick={() => setStep(2)}>
                Continue to Agreement <span className="arrow">→</span>
              </button>
            </div>
          </div>
        )}

        {/* ── Step 2: Review & Sign ── */}
        {step === 2 && (
          <div className="lp-form-section">
            <div className="lp-field-group">
              <h3 className="lp-section-title">Property Owner Advertising Lease &amp; Service Agreement</h3>
              <div className="lp-draft-notice">
                DRAFT — Pending legal review. Both parties should consult independent counsel before execution.
              </div>
              <div className="lp-agreement">
                <p className="lp-agreement-parties">
                  This agreement is between <strong>Dirty Deedz LLC</strong> (&ldquo;Company&rdquo;) and the property owner
                  or authorized representative named below (&ldquo;Lessor&rdquo;).
                </p>

                <h4>1. Property Ownership Representation</h4>
                <p>You confirm that you are the legal owner or authorized representative of the listed property and have full authority to enter this agreement. You agree to provide proof of ownership (deed, signed lease, business registration, or municipal authorization). You indemnify Dirty Deedz against any claims arising from misrepresentation of ownership.</p>

                <h4>2. Scope of Services</h4>
                <p>Dirty Deedz installs advertising using <strong>Reverse Graffiti</strong> — stencils applied to your sidewalk surface via pressure washing only. <strong>No paint, chemicals, or permanent alterations are made.</strong> After each campaign, we restore the surface to its prior condition (&ldquo;Clean Slate Service&rdquo;).</p>

                <h4>3. Revenue Sharing</h4>
                <p>You receive a revenue share per completed campaign per the Deed Order terms. Payment schedule: 10% on installation, the remainder within 30 days of campaign completion. Exact percentages are detailed in your individual Deed Order.</p>

                <h4>4. Advertising Content Controls</h4>
                <p>You may restrict ad categories on your property. Prohibited content regardless of restriction: pornography, illegal substances, hate speech, tobacco products (where regulated by law), and any content targeting minors.</p>

                <h4>5. Disclaimers &amp; Liability</h4>
                <p>Ad visibility and contrast vary by surface condition and weather. Pressure washing may reveal pre-existing surface variation (&ldquo;ghosting&rdquo;) — this is not damage caused by Dirty Deedz. Dirty Deedz&rsquo;s total liability to you is capped at the total revenue share paid under your Deed Order. <strong>No city, municipality, or state authority may seek refunds from Dirty Deedz for campaigns conducted under this agreement.</strong></p>

                <h4>6. Term &amp; Termination</h4>
                <p>Duration is per your Deed Order. Either party may terminate for material breach with 15 days written notice and opportunity to cure. Indemnification and liability provisions survive termination.</p>

                <h4>7. Governing Law &amp; Disputes</h4>
                <p>This agreement is governed by applicable state law. Disputes go to mediation first, then binding AAA arbitration. Each party retains independent legal counsel at their own expense.</p>
              </div>
            </div>

            <div className="lp-field-group">
              <h3 className="lp-section-title">Electronic Signature</h3>
              <p className="lp-hint">Type your full legal name to sign. By signing you confirm you have read and agree to the terms above.</p>
              <input className="lp-input lp-sig-input" type="text" placeholder="Full Legal Name"
                value={signature} onChange={(e) => setSignature(e.target.value)} />
              <p className="lp-sig-date">Date: {signedDate}</p>
            </div>

            <div className="lp-actions lp-actions--split">
              <button type="button" className="lp-back" onClick={() => setStep(1)}>
                ← Back
              </button>
              <button className="btn btn-primary lp-cta" disabled={!step2Valid} onClick={() => setStep(3)}>
                I Agree &amp; Sign <span className="arrow">→</span>
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Verify Ownership ── */}
        {step === 3 && (
          <div className="lp-form-section">
            <div className="lp-field-group">
              <h3 className="lp-section-title">Business &amp; Ownership Verification</h3>
              <p className="lp-hint">Your application requires identity and ownership verification before approval. This information is kept confidential and used only for review purposes.</p>
              <div className="lp-input-row">
                <input className="lp-input" type="text" placeholder="Registered Business Name *"
                  value={formData.registeredName} onChange={(e) => setFormData({ ...formData, registeredName: e.target.value })} />
                <input className="lp-input" type="text" placeholder="EIN / Tax ID (optional)"
                  value={formData.ein} onChange={(e) => setFormData({ ...formData, ein: e.target.value })} />
              </div>
            </div>

            <div className="lp-field-group">
              <h3 className="lp-section-title">Business ID or Government-Issued ID *</h3>
              <p className="lp-hint">Upload a clear photo or scan.</p>
              <div className="lp-upload-btn-row">
                <input ref={idRef} type="file" accept="image/*,.pdf" style={{ display: "none" }}
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) filePreview(f, setIdPreview); }} />
                <button type="button" className="lp-upload-btn" onClick={() => idRef.current?.click()}>
                  {idPreview ? (
                    <img src={idPreview} alt="ID preview" className="lp-upload-thumb" />
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                      Upload Business ID
                    </>
                  )}
                </button>
                <span className="lp-upload-hint">JPG, PNG, or PDF</span>
              </div>
            </div>

            <div className="lp-field-group">
              <h3 className="lp-section-title">Property Deed or Proof of Ownership</h3>
              <div className="lp-upload-btn-row">
                <input ref={deedRef} type="file" accept="image/*,.pdf" style={{ display: "none" }}
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) filePreview(f, setDeedPreview); }} />
                <button type="button" className="lp-upload-btn" onClick={() => deedRef.current?.click()}>
                  {deedPreview ? (
                    <img src={deedPreview} alt="Deed preview" className="lp-upload-thumb" />
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                      Upload Property Deed
                    </>
                  )}
                </button>
                <span className="lp-upload-hint">JPG, PNG, or PDF</span>
              </div>
            </div>

            <p className="lp-verify-notice">
              Your application will be manually reviewed by the Dirty Deedz team. You may be contacted for
              additional documentation. Approval or denial will be communicated within 5–7 business days.
            </p>

            {submitError && (
              <p style={{ color: "#ef4444", fontSize: "14px", margin: "12px 0 0" }}>{submitError}</p>
            )}

            <div className="lp-actions lp-actions--split">
              <button type="button" className="lp-back" onClick={() => setStep(2)} disabled={submitting}>
                ← Back
              </button>
              <button className="btn btn-primary lp-cta" disabled={!step3Valid || submitting} onClick={handleSubmit}>
                {submitting ? "Submitting…" : "Submit for Review"} {!submitting && <span className="arrow">→</span>}
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

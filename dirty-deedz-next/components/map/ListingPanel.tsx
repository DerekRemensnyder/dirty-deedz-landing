"use client";

import { useState, useRef } from "react";

interface ListingPanelProps {
  open: boolean;
  onClose: () => void;
}

const STEPS = ["Property Details", "Review & Sign", "Verify Ownership"];

export default function ListingPanel({ open, onClose }: ListingPanelProps) {
  const photoRef = useRef<HTMLInputElement>(null);
  const idRef = useRef<HTMLInputElement>(null);
  const deedRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [submitted, setSubmitted] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [idPreview, setIdPreview] = useState<string | null>(null);
  const [deedPreview, setDeedPreview] = useState<string | null>(null);
  const [signature, setSignature] = useState("");
  const [signedDate] = useState(() =>
    new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    address: "",
    neighborhood: "",
    parcelCount: "1",
    notes: "",
    registeredName: "",
    ein: "",
  });

  const filePreview = (file: File, setter: (s: string) => void) => {
    const r = new FileReader();
    r.onload = () => setter(r.result as string);
    r.readAsDataURL(file);
  };

  const handleClose = () => {
    setStep(1);
    setSubmitted(false);
    setPhotoPreview(null);
    setIdPreview(null);
    setDeedPreview(null);
    setSignature("");
    setFormData({
      name: "",
      email: "",
      phone: "",
      businessName: "",
      address: "",
      neighborhood: "",
      parcelCount: "1",
      notes: "",
      registeredName: "",
      ein: "",
    });
    onClose();
  };

  const step1Valid =
    formData.name.trim() &&
    formData.email.trim() &&
    formData.address.trim();

  const step2Valid = signature.trim().length > 2;

  const step3Valid =
    formData.registeredName.trim() && (idPreview || deedPreview);

  return (
    <div className={`booking-overlay${open ? " open" : ""}`}>
      <div className="booking-panel">
        <button className="booking-close" onClick={handleClose} aria-label="Close">
          &times;
        </button>

        {submitted ? (
          <div className="booking-success">
            <div className="success-icon">&#10003;</div>
            <h3>Application Received</h3>
            <p>
              Your listing for <strong>{formData.address}</strong> is under
              review. We&rsquo;ll verify your ownership documents and reach out
              within 48–72 hours with next steps.
            </p>
            <button className="btn btn-primary listing-cta" onClick={handleClose}>
              Back to Map
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="booking-pin-summary">
              <span className="booking-status" style={{ color: "#d5ff45" }}>
                Property Owner
              </span>
              <h3>List Your Deedz</h3>
              <p className="booking-address">
                Register your sidewalk parcels and start earning ad revenue.
              </p>
            </div>

            {/* Step indicator */}
            <div className="listing-steps">
              {STEPS.map((label, i) => (
                <div
                  key={label}
                  className={`listing-step${step === i + 1 ? " active" : step > i + 1 ? " done" : ""}`}
                >
                  <span className="listing-step-num">{step > i + 1 ? "✓" : i + 1}</span>
                  <span className="listing-step-label">{label}</span>
                </div>
              ))}
            </div>

            {/* ── Step 1: Property Details ── */}
            {step === 1 && (
              <div className="listing-step-body">
                {/* Photo upload */}
                <div className="booking-ad-details">
                  <label>Sidewalk Photo</label>
                  <div
                    className="listing-upload"
                    onClick={() => photoRef.current?.click()}
                  >
                    {photoPreview ? (
                      <img src={photoPreview} alt="Sidewalk preview" className="listing-upload-preview" />
                    ) : (
                      <div className="listing-upload-placeholder">
                        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                        <span>Upload a photo of your sidewalk</span>
                        <small>JPG, PNG up to 10MB</small>
                      </div>
                    )}
                    <input ref={photoRef} type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) filePreview(f, setPhotoPreview); }} style={{ display: "none" }} />
                  </div>
                </div>

                {/* Property details */}
                <div className="booking-form">
                  <label>Property Details</label>
                  <input type="text" placeholder="Street Address *" required value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                  <div className="listing-parcel-row">
                    <label>Number of Parcels</label>
                    <div className="term-pills">
                      {["1", "2", "3", "4+"].map((n) => (
                        <button key={n} type="button" className={`term-pill${formData.parcelCount === n ? " active" : ""}`} onClick={() => setFormData({ ...formData, parcelCount: n })}>
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>

                  <label>Your Details</label>
                  <input type="text" placeholder="Full Name *" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                  <input type="email" placeholder="Email *" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                  <input type="tel" placeholder="Phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                  <input type="text" placeholder="Business Name (optional)" value={formData.businessName} onChange={(e) => setFormData({ ...formData, businessName: e.target.value })} />
                  <textarea placeholder="Anything else we should know about your property..." rows={3} value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />

                  <button
                    type="button"
                    className="btn btn-primary listing-cta"
                    disabled={!step1Valid}
                    onClick={() => setStep(2)}
                  >
                    Continue to Agreement <span className="arrow">→</span>
                  </button>
                </div>
              </div>
            )}

            {/* ── Step 2: Agreement ── */}
            {step === 2 && (
              <div className="listing-step-body">
                <div className="listing-agreement">
                  <div className="listing-agreement-draft-notice">
                    DRAFT — Pending legal review. Both parties should consult independent counsel before execution.
                  </div>

                  <div className="listing-agreement-scroll">
                    <h4>Dirty Deedz — Property Owner Advertising Lease &amp; Service Agreement</h4>

                    <p className="listing-agreement-parties">
                      This agreement is between <strong>Dirty Deedz LLC</strong> ("Company") and the property owner or authorized representative named below ("Lessor").
                    </p>

                    <h5>1. Property Ownership Representation</h5>
                    <p>You confirm that you are the legal owner or authorized representative of the listed property and have full authority to enter this agreement. You agree to provide proof of ownership (deed, signed lease, business registration, or municipal authorization). You indemnify Dirty Deedz against any claims arising from misrepresentation of ownership.</p>

                    <h5>2. Scope of Services</h5>
                    <p>Dirty Deedz installs advertising using <strong>Reverse Graffiti</strong> — stencils applied to your sidewalk surface via pressure washing only. <strong>No paint, chemicals, or permanent alterations are made.</strong> After each campaign, we restore the surface to its prior condition ("Clean Slate Service").</p>

                    <h5>3. Revenue Sharing</h5>
                    <p>You receive a revenue share per completed campaign per the Deed Order terms. Payment schedule: 10% on installation, the remainder within 30 days of campaign completion. Exact percentages are detailed in your individual Deed Order.</p>

                    <h5>4. Advertising Content Controls</h5>
                    <p>You may restrict ad categories on your property. Prohibited content regardless of restriction: pornography, illegal substances, hate speech, tobacco products (where regulated by law), and any content targeting minors.</p>

                    <h5>5. Disclaimers &amp; Liability</h5>
                    <p>Ad visibility and contrast vary by surface condition and weather. Pressure washing may reveal pre-existing surface variation ("ghosting") — this is not damage caused by Dirty Deedz. Dirty Deedz's total liability to you is capped at the total revenue share paid under your Deed Order. <strong>No city, municipality, or state authority may seek refunds from Dirty Deedz for campaigns conducted under this agreement.</strong></p>

                    <h5>6. Term &amp; Termination</h5>
                    <p>Duration is per your Deed Order. Either party may terminate for material breach with 15 days written notice and opportunity to cure. Indemnification and liability provisions survive termination.</p>

                    <h5>7. Governing Law &amp; Disputes</h5>
                    <p>This agreement is governed by applicable state law. Disputes go to mediation first, then binding AAA arbitration. Each party retains independent legal counsel at their own expense.</p>
                  </div>
                </div>

                {/* E-signature */}
                <div className="listing-signature">
                  <label>Electronic Signature</label>
                  <p className="listing-signature-hint">
                    Type your full legal name below to sign this agreement. By signing you confirm you have read, understood, and agree to the terms above.
                  </p>
                  <input
                    type="text"
                    className="listing-signature-input"
                    placeholder="Full Legal Name"
                    value={signature}
                    onChange={(e) => setSignature(e.target.value)}
                  />
                  <p className="listing-signature-date">Date: {signedDate}</p>
                </div>

                <div className="listing-cta-row">
                  <button type="button" className="booking-add-more" onClick={() => setStep(1)}>
                    <span className="arrow-back">←</span> Back
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary listing-cta"
                    disabled={!step2Valid}
                    onClick={() => setStep(3)}
                  >
                    I Agree &amp; Sign <span className="arrow">→</span>
                  </button>
                </div>
              </div>
            )}

            {/* ── Step 3: Verify Ownership ── */}
            {step === 3 && (
              <div className="listing-step-body">
                <div className="booking-ad-details">
                  <label>Business &amp; Ownership Verification</label>
                  <p className="booking-parcels-hint">
                    Your application requires identity and ownership verification before approval. This information is kept confidential and used only for review purposes.
                  </p>

                  <div className="booking-form" style={{ paddingTop: 0 }}>
                    <input
                      type="text"
                      placeholder="Registered Business Name *"
                      value={formData.registeredName}
                      onChange={(e) => setFormData({ ...formData, registeredName: e.target.value })}
                    />
                    <input
                      type="text"
                      placeholder="EIN / Tax ID (optional)"
                      value={formData.ein}
                      onChange={(e) => setFormData({ ...formData, ein: e.target.value })}
                    />
                  </div>

                  {/* Business ID upload */}
                  <label style={{ marginTop: "16px" }}>Business ID or Government-Issued ID *</label>
                  <div className="booking-upload-row">
                    <input ref={idRef} type="file" accept="image/*,.pdf" className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; if (f) filePreview(f, setIdPreview); }} />
                    <button type="button" className="booking-upload-btn" onClick={() => idRef.current?.click()}>
                      {idPreview ? (
                        <img src={idPreview} alt="ID preview" className="upload-thumb" />
                      ) : (
                        <>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                          Upload Business ID
                        </>
                      )}
                    </button>
                    <span className="upload-hint">JPG, PNG, or PDF</span>
                  </div>

                  {/* Property deed upload */}
                  <label style={{ marginTop: "16px" }}>Property Deed or Proof of Ownership</label>
                  <div className="booking-upload-row">
                    <input ref={deedRef} type="file" accept="image/*,.pdf" className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; if (f) filePreview(f, setDeedPreview); }} />
                    <button type="button" className="booking-upload-btn" onClick={() => deedRef.current?.click()}>
                      {deedPreview ? (
                        <img src={deedPreview} alt="Deed preview" className="upload-thumb" />
                      ) : (
                        <>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                          Upload Property Deed
                        </>
                      )}
                    </button>
                    <span className="upload-hint">JPG, PNG, or PDF</span>
                  </div>

                  <p className="listing-verify-notice">
                    Your application will be manually reviewed by the Dirty Deedz team. You may be contacted for additional documentation. Approval or denial will be communicated within 5–7 business days.
                  </p>
                </div>

                <div className="listing-cta-row">
                  <button type="button" className="booking-add-more" onClick={() => setStep(2)}>
                    <span className="arrow-back">←</span> Back
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary listing-cta"
                    disabled={!step3Valid}
                    onClick={() => setSubmitted(true)}
                  >
                    Submit for Review <span className="arrow">→</span>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

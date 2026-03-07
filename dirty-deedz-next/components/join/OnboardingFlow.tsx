"use client";

import { useState, useRef } from "react";
import LicensingAgreement from "./LicensingAgreement";

const STEPS = [
  "Account Info",
  "Training",
  "Credentials",
  "Stripe Connect",
  "Agreement & Sign",
];

export default function OnboardingFlow() {
  const licenseRef = useRef<HTMLInputElement>(null);
  const coiRef = useRef<HTMLInputElement>(null);
  const idRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    companyName: "",
    zipInput: "",
  });
  const [serviceZips, setServiceZips] = useState<string[]>([]);
  const [videoWatched, setVideoWatched] = useState(false);

  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [licensePreview, setLicensePreview] = useState<string | null>(null);
  const [coiFile, setCoiFile] = useState<File | null>(null);
  const [coiPreview, setCoiPreview] = useState<string | null>(null);
  const [idFile, setIdFile] = useState<File | null>(null);
  const [idPreview, setIdPreview] = useState<string | null>(null);

  const [signature, setSignature] = useState("");
  const [signedDate] = useState(() =>
    new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  );

  const set = (key: string, val: string) =>
    setFormData((prev) => ({ ...prev, [key]: val }));

  /* ── Zip chip helpers ── */
  const addZip = () => {
    const z = formData.zipInput.trim();
    if (z && /^\d{5}$/.test(z) && !serviceZips.includes(z)) {
      setServiceZips((prev) => [...prev, z]);
      set("zipInput", "");
    }
  };
  const removeZip = (z: string) =>
    setServiceZips((prev) => prev.filter((x) => x !== z));
  const handleZipKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addZip();
    }
  };

  /* ── File preview helper ── */
  const handleFile = (
    file: File,
    setFile: (f: File) => void,
    setPreview: (s: string) => void
  ) => {
    setFile(file);
    const r = new FileReader();
    r.onload = () => setPreview(r.result as string);
    r.readAsDataURL(file);
  };

  /* ── Validation ── */
  const step1Valid =
    formData.name.trim() &&
    formData.email.trim() &&
    formData.phone.trim() &&
    formData.companyName.trim() &&
    serviceZips.length > 0;

  const step2Valid = videoWatched;
  const step3Valid = licenseFile && coiFile && idFile;
  const step4Valid = true; // MVP placeholder — always passable
  const step5Valid = signature.trim().length > 2;

  /* ── Submit ── */
  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("name", formData.name);
      fd.append("email", formData.email);
      fd.append("phone", formData.phone);
      fd.append("companyName", formData.companyName);
      serviceZips.forEach((z) => fd.append("serviceZips", z));
      fd.append("signature", signature);
      if (licenseFile) fd.append("businessLicense", licenseFile);
      if (coiFile) fd.append("coi", coiFile);
      if (idFile) fd.append("governmentId", idFile);

      const res = await fetch("/api/contractors", { method: "POST", body: fd });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Submission failed");
      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Upload button SVG ── */
  const uploadIcon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );

  /* ══════════════════════════════════════════════════ */
  return (
    <section className="join-onboarding section" id="onboarding">
      <div className="container">
        <div className="join-inner">
        <span className="section-label">Apply Now</span>
        <h2 className="section-title">Contractor Application</h2>
        <p className="section-sub" style={{ marginBottom: "40px" }}>
          Complete all five steps to submit your application. We review every
          submission within 48&ndash;72 hours.
        </p>

        <div className="join-form-card">
          {submitted ? (
            /* ── Success ── */
            <div className="booking-success">
              <div className="success-icon">&#10003;</div>
              <h3>Application Submitted</h3>
              <p>
                Thanks, <strong>{formData.name}</strong>! Your contractor
                application is under review. We&rsquo;ll be in touch within
                48&ndash;72 hours with next steps.
              </p>
              <a href="/" className="btn btn-primary" style={{ marginTop: "16px" }}>
                Back to Home <span className="arrow">&rarr;</span>
              </a>
            </div>
          ) : (
            <>
              {/* ── Step indicator ── */}
              <div className="listing-steps">
                {STEPS.map((label, i) => (
                  <div
                    key={label}
                    className={`listing-step${step === i + 1 ? " active" : step > i + 1 ? " done" : ""}`}
                  >
                    <span className="listing-step-num">
                      {step > i + 1 ? "\u2713" : i + 1}
                    </span>
                    <span className="listing-step-label">{label}</span>
                  </div>
                ))}
              </div>

              {error && (
                <p style={{ color: "#df3257", fontSize: ".85rem", margin: "12px 0 0" }}>
                  {error}
                </p>
              )}

              {/* ═══ STEP 1 — Account Info ═══ */}
              {step === 1 && (
                <div className="listing-step-body">
                  <div className="booking-form">
                    <label>Your Details</label>
                    <input type="text" placeholder="Full Name *" value={formData.name} onChange={(e) => set("name", e.target.value)} />
                    <input type="email" placeholder="Email *" value={formData.email} onChange={(e) => set("email", e.target.value)} />
                    <input type="tel" placeholder="Phone *" value={formData.phone} onChange={(e) => set("phone", e.target.value)} />
                    <input type="text" placeholder="Company / Business Name *" value={formData.companyName} onChange={(e) => set("companyName", e.target.value)} />

                    <label style={{ marginTop: "16px" }}>Service Zip Codes *</label>
                    <p className="booking-parcels-hint">
                      Enter your service area zip code(s). Add more with the Add button.
                    </p>
                    {serviceZips.length > 0 && (
                      <div className="join-zip-chips">
                        {serviceZips.map((z) => (
                          <span key={z} className="join-zip-chip">
                            {z}
                            <button type="button" onClick={() => removeZip(z)}>&times;</button>
                          </span>
                        ))}
                      </div>
                    )}
                    <div style={{ display: "flex", gap: "8px", alignItems: "stretch" }}>
                      <input
                        type="text"
                        placeholder="e.g. 10001"
                        maxLength={5}
                        value={formData.zipInput}
                        onChange={(e) => set("zipInput", e.target.value.replace(/\D/g, ""))}
                        onKeyDown={handleZipKey}
                        style={{ flex: 1 }}
                      />
                      <button type="button" className="btn btn-outline" style={{ fontSize: ".8rem", padding: "0 16px", borderRadius: "8px", height: "44px" }} onClick={addZip}>
                        Add
                      </button>
                    </div>

                    <button
                      type="button"
                      className="btn btn-primary listing-cta"
                      disabled={!step1Valid && !(formData.zipInput.trim() && /^\d{5}$/.test(formData.zipInput.trim()))}
                      onClick={() => {
                        // Auto-add any typed zip before continuing
                        const z = formData.zipInput.trim();
                        if (z && /^\d{5}$/.test(z) && !serviceZips.includes(z)) {
                          setServiceZips((prev) => [...prev, z]);
                          set("zipInput", "");
                        }
                        // Small delay to let state update, then advance
                        setTimeout(() => setStep(2), 50);
                      }}
                      style={{ marginTop: "24px" }}
                    >
                      Continue <span className="arrow">&rarr;</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ═══ STEP 2 — Training Video ═══ */}
              {step === 2 && (
                <div className="listing-step-body">
                  <div className="booking-ad-details">
                    <label>Certification Training</label>
                    <p className="booking-parcels-hint">
                      Watch the training video to learn our reverse-graffiti installation process, safety standards, and quality requirements.
                    </p>

                    <div className="join-video-placeholder">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}>
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                      <span>Training video coming soon</span>
                      <small>For now, check the box below to continue.</small>
                    </div>

                    <label className="join-checkbox-row" style={{ marginTop: "20px" }}>
                      <input
                        type="checkbox"
                        checked={videoWatched}
                        onChange={(e) => setVideoWatched(e.target.checked)}
                      />
                      <span>I have reviewed the training materials and understand the service standards.</span>
                    </label>
                  </div>

                  <div className="listing-cta-row">
                    <button type="button" className="booking-add-more" onClick={() => setStep(1)}>
                      <span className="arrow-back">&larr;</span> Back
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary listing-cta"
                      disabled={!step2Valid}
                      onClick={() => setStep(3)}
                    >
                      Continue <span className="arrow">&rarr;</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ═══ STEP 3 — Credentials ═══ */}
              {step === 3 && (
                <div className="listing-step-body">
                  <div className="booking-ad-details">
                    <label>Upload Credentials</label>
                    <p className="booking-parcels-hint">
                      We need three documents to verify your eligibility. All files are stored securely and used only for review.
                    </p>

                    {/* Business License */}
                    <label style={{ marginTop: "16px" }}>Business License *</label>
                    <div className="booking-upload-row">
                      <input ref={licenseRef} type="file" accept="image/*,.pdf" className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f, setLicenseFile, setLicensePreview); }} />
                      <button type="button" className="booking-upload-btn" onClick={() => licenseRef.current?.click()}>
                        {licensePreview ? (
                          <img src={licensePreview} alt="License preview" className="upload-thumb" />
                        ) : (
                          <>{uploadIcon} Upload Business License</>
                        )}
                      </button>
                      <span className="upload-hint">JPG, PNG, or PDF</span>
                    </div>

                    {/* Certificate of Insurance */}
                    <label style={{ marginTop: "16px" }}>Certificate of Insurance (COI) *</label>
                    <div className="booking-upload-row">
                      <input ref={coiRef} type="file" accept="image/*,.pdf" className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f, setCoiFile, setCoiPreview); }} />
                      <button type="button" className="booking-upload-btn" onClick={() => coiRef.current?.click()}>
                        {coiPreview ? (
                          <img src={coiPreview} alt="COI preview" className="upload-thumb" />
                        ) : (
                          <>{uploadIcon} Upload COI</>
                        )}
                      </button>
                      <span className="upload-hint">JPG, PNG, or PDF</span>
                    </div>

                    {/* Government ID */}
                    <label style={{ marginTop: "16px" }}>Government-Issued ID *</label>
                    <div className="booking-upload-row">
                      <input ref={idRef} type="file" accept="image/*,.pdf" className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f, setIdFile, setIdPreview); }} />
                      <button type="button" className="booking-upload-btn" onClick={() => idRef.current?.click()}>
                        {idPreview ? (
                          <img src={idPreview} alt="ID preview" className="upload-thumb" />
                        ) : (
                          <>{uploadIcon} Upload Government ID</>
                        )}
                      </button>
                      <span className="upload-hint">JPG, PNG, or PDF</span>
                    </div>
                  </div>

                  <div className="listing-cta-row">
                    <button type="button" className="booking-add-more" onClick={() => setStep(2)}>
                      <span className="arrow-back">&larr;</span> Back
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary listing-cta"
                      disabled={!step3Valid}
                      onClick={() => setStep(4)}
                    >
                      Continue <span className="arrow">&rarr;</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ═══ STEP 4 — Stripe Connect ═══ */}
              {step === 4 && (
                <div className="listing-step-body">
                  <div className="booking-ad-details">
                    <label>Payment Setup</label>
                    <p className="booking-parcels-hint">
                      Connect your bank account so we can pay you for completed jobs.
                    </p>

                    <div className="join-stripe-placeholder">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}>
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                        <line x1="1" y1="10" x2="23" y2="10" />
                      </svg>
                      <span>Stripe Connect integration coming soon</span>
                      <small>You&rsquo;ll be able to link your bank account here. For now, proceed to the next step &mdash; we&rsquo;ll set up payments after approval.</small>
                    </div>
                  </div>

                  <div className="listing-cta-row">
                    <button type="button" className="booking-add-more" onClick={() => setStep(3)}>
                      <span className="arrow-back">&larr;</span> Back
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary listing-cta"
                      disabled={!step4Valid}
                      onClick={() => setStep(5)}
                    >
                      Continue <span className="arrow">&rarr;</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ═══ STEP 5 — Agreement & E-Sign ═══ */}
              {step === 5 && (
                <div className="listing-step-body">
                  <div className="listing-agreement">
                    <div className="listing-agreement-draft-notice">
                      DRAFT &mdash; Pending legal review. Both parties should consult independent counsel before execution.
                    </div>
                    <LicensingAgreement />
                  </div>

                  {/* E-signature */}
                  <div className="listing-signature">
                    <label>Electronic Signature</label>
                    <p className="listing-signature-hint">
                      Type your full legal name below to sign this agreement. By
                      signing you confirm you have read, understood, and agree to
                      the terms above.
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
                    <button type="button" className="booking-add-more" onClick={() => setStep(4)}>
                      <span className="arrow-back">&larr;</span> Back
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary listing-cta"
                      disabled={!step5Valid || submitting}
                      onClick={handleSubmit}
                    >
                      {submitting ? "Submitting\u2026" : "Submit Application"}{" "}
                      {!submitting && <span className="arrow">&rarr;</span>}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState, useRef } from "react";

interface ListingPanelProps {
  open: boolean;
  onClose: () => void;
}

export default function ListingPanel({ open, onClose }: ListingPanelProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    address: "",
    neighborhood: "",
    parcelCount: "1",
    notes: "",
  });

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleClose = () => {
    setSubmitted(false);
    setPreview(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      businessName: "",
      address: "",
      neighborhood: "",
      parcelCount: "1",
      notes: "",
    });
    onClose();
  };

  return (
    <div className={`booking-overlay${open ? " open" : ""}`}>
      <div className="booking-panel">
        <button className="booking-close" onClick={handleClose} aria-label="Close">
          &times;
        </button>

        {submitted ? (
          <div className="booking-success">
            <div className="success-icon">&#10003;</div>
            <h3>Deedz Listed</h3>
            <p>
              We&rsquo;ve received your listing for{" "}
              <strong>{formData.address || "your property"}</strong>. Our team
              will review and reach out within 48 hours to get you set up.
            </p>
            <button className="btn btn-primary" onClick={handleClose}>
              Back to Map
            </button>
          </div>
        ) : (
          <>
            <div className="booking-pin-summary">
              <span className="booking-status" style={{ color: "#d5ff45" }}>
                Property Owner
              </span>
              <h3>List Your Deedz</h3>
              <p className="booking-address">
                Register your sidewalk or wall parcels and start earning ad
                revenue.
              </p>
            </div>

            <form className="booking-form" onSubmit={handleSubmit}>
              {/* Image upload */}
              <label>Sidewalk Photo</label>
              <div
                className="listing-upload"
                onClick={() => fileRef.current?.click()}
              >
                {preview ? (
                  <img src={preview} alt="Sidewalk preview" className="listing-upload-preview" />
                ) : (
                  <div className="listing-upload-placeholder">
                    <svg
                      viewBox="0 0 24 24"
                      width="28"
                      height="28"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                    <span>Upload a photo of your sidewalk</span>
                    <small>JPG, PNG up to 10MB</small>
                  </div>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFile}
                  style={{ display: "none" }}
                />
              </div>

              {/* Property details */}
              <label>Property Details</label>
              <input
                type="text"
                placeholder="Street Address"
                required
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Neighborhood"
                value={formData.neighborhood}
                onChange={(e) =>
                  setFormData({ ...formData, neighborhood: e.target.value })
                }
              />
              <div className="listing-parcel-row">
                <label>Number of Parcels</label>
                <div className="term-pills">
                  {["1", "2", "3", "4+"].map((n) => (
                    <button
                      key={n}
                      type="button"
                      className={`term-pill${formData.parcelCount === n ? " active" : ""}`}
                      onClick={() =>
                        setFormData({ ...formData, parcelCount: n })
                      }
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact info */}
              <label>Your Details</label>
              <input
                type="text"
                placeholder="Full Name"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <input
                type="email"
                placeholder="Email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              <input
                type="tel"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Business Name (optional)"
                value={formData.businessName}
                onChange={(e) =>
                  setFormData({ ...formData, businessName: e.target.value })
                }
              />
              <textarea
                placeholder="Anything else we should know about your property..."
                rows={3}
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />
              <button type="submit" className="btn btn-primary booking-submit">
                List Your Deedz
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

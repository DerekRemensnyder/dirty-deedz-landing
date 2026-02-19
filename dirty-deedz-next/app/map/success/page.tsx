"use client";

import Nav from "../../../components/Nav";

export default function SuccessPage() {
  return (
    <div className="map-page" style={{ overflow: "auto" }}>
      <Nav />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: "120px 24px 60px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "rgba(0,210,154,0.15)",
            color: "#00d29a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2rem",
            fontWeight: 700,
            marginBottom: 24,
          }}
        >
          &#10003;
        </div>
        <h1
          style={{
            fontFamily: "'Archivo', sans-serif",
            fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
            fontWeight: 800,
            color: "#fff",
            margin: "0 0 12px",
          }}
        >
          Payment Confirmed
        </h1>
        <p
          style={{
            fontFamily: "'Roboto', sans-serif",
            fontSize: "1.05rem",
            color: "rgba(255,255,255,0.6)",
            lineHeight: 1.6,
            maxWidth: 480,
            margin: "0 0 32px",
          }}
        >
          Your Deed is locked in. Our team will reach out within 24 hours with
          next steps to get your ad live on the sidewalk.
        </p>
        <a
          href="/map"
          className="btn btn-primary"
          style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 400 }}
        >
          Back to Map
        </a>
      </div>
    </div>
  );
}

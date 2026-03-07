const TIERS = [
  { term: "2 months", label: "Standard", campaign: "$800", payout: "$160" },
  { term: "4 months", label: "Extended", campaign: "$1,400", payout: "$280" },
  { term: "6 months", label: "Premium", campaign: "$2,000", payout: "$400" },
];

const REQS = [
  "Own or have access to a commercial pressure washer (3,000+ PSI)",
  "Valid business license in your operating state",
  "Commercial General Liability insurance ($1M minimum)",
  "Government-issued photo ID",
  "Reliable vehicle for transporting equipment",
  "Smartphone for job documentation and photo uploads",
];

export default function EarningsBreakdown() {
  return (
    <section className="section" style={{ background: "#111" }}>
      <div className="container">
        <div className="join-inner">
          <span className="section-label">Earnings</span>
          <h2 className="section-title">What You Can Earn</h2>
          <p className="section-sub" style={{ marginBottom: "40px" }}>
            Contractors earn <strong style={{ color: "#d5ff45" }}>20% of campaign revenue</strong> per completed installation. Each Deed is a standard sidewalk parcel &mdash; longer campaigns pay more.
          </p>

          <div className="join-earnings-table">
            <div className="join-earnings-header">
              <span>Campaign Term</span>
              <span>Tier</span>
              <span>Campaign Value</span>
              <span>Your Payout</span>
            </div>
            {TIERS.map((t) => (
              <div key={t.label} className="join-earnings-row">
                <span>{t.term}</span>
                <span>{t.label}</span>
                <span>{t.campaign}</span>
                <span className="join-earnings-payout">{t.payout}</span>
              </div>
            ))}
          </div>

          <div className="join-requirements">
            <h3>Requirements</h3>
            <ul>
              {REQS.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

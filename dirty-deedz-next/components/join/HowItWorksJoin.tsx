const STEPS = [
  {
    num: "01",
    title: "Sign Up",
    desc: "Complete our 5-step application with your credentials, insurance, and service areas.",
  },
  {
    num: "02",
    title: "Get Certified",
    desc: "Watch our training video and learn the reverse-graffiti installation process.",
  },
  {
    num: "03",
    title: "Claim Jobs",
    desc: "Browse available campaigns in your registered zip codes and claim the ones that fit your schedule.",
  },
  {
    num: "04",
    title: "Get Paid",
    desc: "Complete installations, upload proof photos, and get paid via Stripe within 7 days.",
  },
];

export default function HowItWorksJoin() {
  return (
    <section className="section">
      <div className="container">
        <div className="join-how-card">

          {/* Header inside the card */}
          <div className="join-how-header">
            <span className="section-label">How It Works</span>
            <h2 className="section-title">Four Steps to Your First Job</h2>
            <p className="section-sub">
              From application to your first paycheck &mdash; here&rsquo;s the path.
            </p>
          </div>

          {/* Steps */}
          <div className="join-how-steps">
            {STEPS.map((s) => (
              <div key={s.num} className="join-how-step">
                <div className="join-how-img-placeholder" aria-hidden="true" />
                <div className="join-how-step-title">
                  <span className="join-how-num">{s.num}</span>
                  <h3>{s.title}</h3>
                </div>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>

          {/* Footnote */}
          <p className="join-how-footnote">
            &lowast;&nbsp;Jobs are matched based on proximity, completion rate, account standing, and local availability.
          </p>

        </div>
      </div>
    </section>
  );
}

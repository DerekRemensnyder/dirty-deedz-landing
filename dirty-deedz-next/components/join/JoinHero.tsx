export default function JoinHero() {
  return (
    <section className="join-hero">
      <div className="container">
        <div className="join-hero-layout">

          {/* Left — contractor image placeholder */}
          <div className="join-hero-img-placeholder" aria-hidden="true" />

          {/* Right — copy */}
          <div className="join-hero-copy">
            <span className="section-label">Contractors</span>
            <h1>
              Become a Dirty Deedz<br />
              Licensed Contractor
            </h1>
            <p>
              Join our nationwide network of power washing pros. Install
              reverse-graffiti stencil ads on sidewalks&nbsp;&mdash; earn up to $400
              per job with flexible scheduling and zero inventory.
            </p>
            <a
              href="#onboarding"
              className="btn btn-primary"
              style={{ marginTop: "12px" }}
            >
              Apply Now <span className="arrow">&rarr;</span>
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}

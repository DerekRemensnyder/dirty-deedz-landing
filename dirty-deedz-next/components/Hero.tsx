export default function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="hero-shape hero-shape-1" />
      <div className="hero-shape hero-shape-2" />
      <div className="hero-content">
        <h1>
          Down &amp; Dirty
          <br />
          Advertising.
        </h1>
        <p>When ads go high, we go low.</p>
        <div className="hero-buttons">
          <a href="#pricing" className="btn btn-outline">
            Lease My Sidewalk <span className="arrow">{"→"}</span>
          </a>
          <a href="#pricing" className="btn btn-outline">
            Advertise On Sidewalk <span className="arrow">{"→"}</span>
          </a>
        </div>
      </div>
    </section>
  );
}

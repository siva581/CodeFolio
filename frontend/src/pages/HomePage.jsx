import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <section className="hero-shell">
      <div className="hero-copy card glass-card hero-card">
        <span className="eyebrow">Developer Portfolio</span>
        <h1>Build a clean portfolio.</h1>
        <p>
          Create your profile, publish projects and skills, and share your public URL with a responsive
          design.
        </p>
        <div className="actions-row">
          <Link to="/auth" className="btn">Get Started</Link>
          <Link className="btn btn-ghost" to="/u/demo1">View Demo</Link>
        </div>
        <div className="stat-row">
          <div>
            <strong>01</strong>
            <span>Custom profile</span>
          </div>
          <div>
            <strong>02</strong>
            <span>Projects and skills</span>
          </div>
          <div>
            <strong>03</strong>
            <span>Public sharing link</span>
          </div>
        </div>
      </div>

      <div className="feature-stack">
        <article className="card glass-card feature-card">
          <h2>From data to portfolio in seconds</h2>
          <p>Input your projects and skills, and let CodeFolio craft a polished developer presence.</p>
        </article>
        <article className="card glass-card feature-card">
          <h2>Optimized layouts, everywhere</h2>
          <p>Every template is engineered for performance, clarity, and seamless responsiveness.</p>
        </article>
      </div>
    </section>
  );
}

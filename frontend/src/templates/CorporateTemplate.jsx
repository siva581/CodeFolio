import ProfileDetailsSection from "../components/ProfileDetailsSection";

function Stat({ label, value }) {
  return (
    <div className="corporate-stat">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

export default function CorporateTemplate({ data, mode = "public" }) {
  const { profile, projects, skills } = data;
  const isPreview = mode === "preview";

  return (
    <div className={`template-shell template-corporate-shell ${isPreview ? "is-preview" : ""}`}>
      <header className="template-hero template-hero-corporate">
        <div>
          <span className="eyebrow">Corporate</span>
          <h1>{profile.full_name || profile.username || "Your Name"}</h1>
          {profile.title && <h2>{profile.title}</h2>}
          {profile.bio && <p>{profile.bio}</p>}
        </div>
        <aside className="corporate-aside">
          {profile.is_pro && <span className="pro-badge">PRO USER</span>}
          {profile.custom_domain && <span className="domain-pill">{profile.custom_domain}</span>}
          <div className="corporate-stat-grid">
            <Stat label="Projects" value={projects.length} />
            <Stat label="Skills" value={skills.length} />
          </div>
        </aside>
      </header>

      <ProfileDetailsSection profile={profile} />

      <section>
        <h3>Highlights</h3>
        <div className="corporate-grid">
          <div className="corporate-panel">
            <h4>Skill Stack</h4>
            <div className="skill-cloud skill-cloud-tight">
              {skills.length ? skills.map((skill) => <span className="skill-pill" key={skill.id}>{skill.name}</span>) : <p className="empty-state">No skills yet.</p>}
            </div>
          </div>
          <div className="corporate-panel">
            <h4>Projects</h4>
            <div className="portfolio-list portfolio-list-tight">
              {projects.length ? projects.map((project) => (
                <article className="portfolio-item corporate-project" key={project.id}>
                  <strong>{project.title}</strong>
                  <p>{project.description}</p>
                </article>
              )) : <p className="empty-state">Add a few project showcases.</p>}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
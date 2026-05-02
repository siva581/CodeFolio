import ProfileDetailsSection from "../components/ProfileDetailsSection";

function ProjectCard({ project }) {
  return (
    <article className="cyber-project-card">
      {project.screenshot_url && (
        <div className="cyber-project-image">
          <img src={project.screenshot_url} alt={project.title} />
        </div>
      )}
      <div className="cyber-project-body">
        <h4>{project.title}</h4>
        <p>{project.description}</p>
        <div className="cyber-tech">
          {project.tech_stack?.map((t, i) => (
            <span key={i} className="cyber-tag">{t}</span>
          ))}
        </div>
        <div className="cyber-links">
          {project.live_url && <a href={project.live_url} target="_blank" rel="noreferrer">Live</a>}
          {project.repo_url && <a href={project.repo_url} target="_blank" rel="noreferrer">Code</a>}
        </div>
      </div>
    </article>
  );
}

export default function CyberpunkTemplate({ data, mode = "public" }) {
  const { profile, projects, skills } = data;
  const isPreview = mode === "preview";

  return (
    <div className={`template-shell template-cyber-shell ${isPreview ? "is-preview" : ""}`}>
      <header className="template-hero template-hero-cyber">
        <div>
          <span className="eyebrow cyber-eyebrow">Cyberpunk</span>
          <h1 className="cyber-title">{profile.full_name || profile.username || "Your Name"}</h1>
          {profile.title && <h2 className="cyber-sub">{profile.title}</h2>}
          {profile.bio && <p className="cyber-bio">{profile.bio}</p>}
        </div>
        <div className="cyber-badges">
          {profile.is_pro && <span className="pro-badge">PRO</span>}
        </div>
      </header>

      <ProfileDetailsSection profile={profile} />

      {skills.length > 0 && (
        <section className="cyber-skills">
          <h3>Skills</h3>
          <div className="cyber-skill-list">
            {skills.map(s => <span key={s.id} className="cyber-skill">{s.name}</span>)}
          </div>
        </section>
      )}

      {projects.length > 0 && (
        <section className="cyber-projects">
          <h3>Projects</h3>
          <div className="cyber-projects-grid">
            {projects.map(p => <ProjectCard key={p.id} project={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}

import ProfileDetailsSection from "../components/ProfileDetailsSection";

function ProjectCard({ project }) {
  return (
    <article className="material-project-card">
      <div className="material-project-body">
        <h4>{project.title}</h4>
        <p>{project.description}</p>
        <div className="material-tech">
          {project.tech_stack?.map((t, i) => (
            <span key={i} className="material-chip">{t}</span>
          ))}
        </div>
        <div className="material-links">
          {project.live_url && <a href={project.live_url} target="_blank" rel="noreferrer">Live</a>}
          {project.repo_url && <a href={project.repo_url} target="_blank" rel="noreferrer">Code</a>}
        </div>
      </div>
    </article>
  );
}

export default function MaterialTemplate({ data, mode = "public" }) {
  const { profile, projects, skills } = data;
  const isPreview = mode === "preview";

  return (
    <div className={`template-shell template-material-shell ${isPreview ? "is-preview" : ""}`}>
      <header className="template-hero template-hero-material">
        <div>
          <span className="eyebrow material-eyebrow">Material</span>
          <h1 className="material-title">{profile.full_name || profile.username || "Your Name"}</h1>
          {profile.title && <h2 className="material-sub">{profile.title}</h2>}
          {profile.bio && <p className="material-bio">{profile.bio}</p>}
        </div>
        <div className="material-aside">
          {profile.is_pro && <span className="pro-badge">PRO</span>}
        </div>
      </header>

      <ProfileDetailsSection profile={profile} />

      {skills.length > 0 && (
        <section className="material-skills">
          <h3>Skills</h3>
          <div className="material-skill-grid">
            {skills.map(s => <div key={s.id} className="material-skill-item">{s.name}</div>)}
          </div>
        </section>
      )}

      {projects.length > 0 && (
        <section className="material-projects">
          <h3>Projects</h3>
          <div className="material-projects-list">
            {projects.map(p => <ProjectCard key={p.id} project={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}

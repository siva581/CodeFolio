import ProfileDetailsSection from "../components/ProfileDetailsSection";

function ProjectCard({ project }) {
  return (
    <article className="startup-project-card">
      <div className="startup-project-top">
        <h4>{project.title}</h4>
        <span className="startup-project-icon">→</span>
      </div>
      <p>{project.description}</p>
      {project.tech_stack?.length && (
        <div className="startup-tech-list">
          {project.tech_stack.map((tech, idx) => (
            <span key={idx} className="startup-tech-badge">{tech}</span>
          ))}
        </div>
      )}
      <div className="startup-project-footer">
        {project.live_url && (
          <a href={project.live_url} target="_blank" rel="noreferrer">View Project</a>
        )}
        {project.repo_url && (
          <a href={project.repo_url} target="_blank" rel="noreferrer">View Code</a>
        )}
      </div>
    </article>
  );
}

export default function StartupTemplate({ data, mode = "public" }) {
  const { profile, projects, skills } = data;
  const isPreview = mode === "preview";

  return (
    <div className={`template-shell template-startup-shell ${isPreview ? "is-preview" : ""}`}>
      <header className="template-hero template-hero-startup">
        <div className="startup-hero-content">
          <span className="eyebrow startup-eyebrow">Startup</span>
          <h1 className="startup-name">{profile.full_name || profile.username || "Your Name"}</h1>
          {profile.title && <h2 className="startup-title">{profile.title}</h2>}
          {profile.bio && <p className="startup-bio">{profile.bio}</p>}
          <div className="startup-badges">
            {profile.location && <span className="startup-badge">📍 {profile.location}</span>}
            {profile.is_pro && <span className="startup-badge startup-pro">PRO</span>}
          </div>
        </div>
      </header>

      <ProfileDetailsSection profile={profile} />

      {skills.length > 0 && (
        <section className="startup-skills-section">
          <h3>Core Skills</h3>
          <div className="startup-skills-wrap">
            {skills.slice(0, 12).map(skill => (
              <span key={skill.id} className="startup-skill-tag">{skill.name}</span>
            ))}
            {skills.length > 12 && <span className="startup-skill-more">+{skills.length - 12} more</span>}
          </div>
        </section>
      )}

      {projects.length > 0 && (
        <section className="startup-projects-section">
          <h3>Recent Projects</h3>
          <div className="startup-projects-grid">
            {projects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

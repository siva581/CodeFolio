import ProfileDetailsSection from "../components/ProfileDetailsSection";

function ProjectCard({ project }) {
  return (
    <article className="dark-project-card">
      <div className="dark-project-header">
        <h4>{project.title}</h4>
        <div className="dark-project-links">
          {project.live_url && (
            <a href={project.live_url} target="_blank" rel="noreferrer" title="Live Demo">◆</a>
          )}
          {project.repo_url && (
            <a href={project.repo_url} target="_blank" rel="noreferrer" title="Source Code">▪</a>
          )}
        </div>
      </div>
      <p>{project.description}</p>
      {project.tech_stack?.length && (
        <div className="dark-tech-stack">
          {project.tech_stack.map((tech, idx) => (
            <code key={idx}>{tech}</code>
          ))}
        </div>
      )}
    </article>
  );
}

export default function DarkTemplate({ data, mode = "public" }) {
  const { profile, projects, skills } = data;
  const isPreview = mode === "preview";
  const frontendSkills = skills.filter(s => s.category === "frontend");
  const backendSkills = skills.filter(s => s.category === "backend");
  const toolsSkills = skills.filter(s => s.category === "tools");

  return (
    <div className={`template-shell template-dark-shell ${isPreview ? "is-preview" : ""}`}>
      <header className="template-hero template-hero-dark">
        <div className="dark-hero-main">
          <span className="eyebrow dark-eyebrow">&lt;developer /&gt;</span>
          <h1 className="dark-title">{profile.full_name || profile.username || "Your Name"}</h1>
          {profile.title && <h2 className="dark-subtitle">{profile.title}</h2>}
          {profile.bio && <p className="dark-bio">{profile.bio}</p>}
          <div className="dark-contact">
            {profile.location && <span>📍 {profile.location}</span>}
            {profile.is_pro && <span className="pro-badge dark-pro">PRO</span>}
          </div>
        </div>
      </header>

      <ProfileDetailsSection profile={profile} />

      {(frontendSkills.length > 0 || backendSkills.length > 0 || toolsSkills.length > 0) && (
        <section className="dark-skills-section">
          <h3>[ tech_stack ]</h3>
          <div className="dark-skills-grid">
            {frontendSkills.length > 0 && (
              <div className="dark-skill-group">
                <span className="dark-group-label">frontend:</span>
                <div className="dark-skill-items">
                  {frontendSkills.map(skill => (
                    <span key={skill.id} className="dark-skill">{skill.name}</span>
                  ))}
                </div>
              </div>
            )}
            {backendSkills.length > 0 && (
              <div className="dark-skill-group">
                <span className="dark-group-label">backend:</span>
                <div className="dark-skill-items">
                  {backendSkills.map(skill => (
                    <span key={skill.id} className="dark-skill">{skill.name}</span>
                  ))}
                </div>
              </div>
            )}
            {toolsSkills.length > 0 && (
              <div className="dark-skill-group">
                <span className="dark-group-label">tools:</span>
                <div className="dark-skill-items">
                  {toolsSkills.map(skill => (
                    <span key={skill.id} className="dark-skill">{skill.name}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {projects.length > 0 && (
        <section className="dark-projects-section">
          <h3>[ projects ]</h3>
          <div className="dark-projects-list">
            {projects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

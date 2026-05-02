import ProfileDetailsSection from "../components/ProfileDetailsSection";

function Stat({ label, value }) {
  return (
    <div className="professional-stat">
      <span className="professional-stat-value">{value}</span>
      <span className="professional-stat-label">{label}</span>
    </div>
  );
}

function ProjectCard({ project }) {
  return (
    <article className="professional-project-card">
      <div className="professional-project-title">{project.title}</div>
      <p className="professional-project-desc">{project.description}</p>
      {project.tech_stack?.length && (
        <div className="professional-tech-row">
          {project.tech_stack.map((tech, idx) => (
            <small key={idx}>{tech}</small>
          ))}
        </div>
      )}
      <div className="professional-project-actions">
        {project.live_url && (
          <a href={project.live_url} target="_blank" rel="noreferrer">Visit</a>
        )}
        {project.repo_url && (
          <a href={project.repo_url} target="_blank" rel="noreferrer">Repository</a>
        )}
      </div>
    </article>
  );
}

export default function ProfessionalTemplate({ data, mode = "public" }) {
  const { profile, projects, skills } = data;
  const isPreview = mode === "preview";
  const frontendSkills = skills.filter(s => s.category === "frontend").length;
  const backendSkills = skills.filter(s => s.category === "backend").length;
  const toolsSkills = skills.filter(s => s.category === "tools").length;

  return (
    <div className={`template-shell template-professional-shell ${isPreview ? "is-preview" : ""}`}>
      <header className="template-hero template-hero-professional">
        <div className="professional-header-main">
          <span className="eyebrow professional-eyebrow">Professional</span>
          <h1 className="professional-name">{profile.full_name || profile.username || "Your Name"}</h1>
          {profile.title && <h2 className="professional-title">{profile.title}</h2>}
          {profile.bio && <p className="professional-bio">{profile.bio}</p>}
        </div>
        <aside className="professional-header-stats">
          <Stat label="Projects" value={projects.length} />
          <Stat label="Skills" value={skills.length} />
          <Stat label="Experience" value={frontendSkills + backendSkills > 0 ? "5+" : "3+"} />
          {profile.is_pro && (
            <div className="professional-pro-badge">PRO USER</div>
          )}
        </aside>
      </header>

      <ProfileDetailsSection profile={profile} />

      {skills.length > 0 && (
        <section className="professional-skills-section">
          <h3>Technical Expertise</h3>
          <div className="professional-skills-matrix">
            {frontendSkills > 0 && (
              <div className="professional-skill-column">
                <h4>Frontend</h4>
                <ul>
                  {skills.filter(s => s.category === "frontend").map(skill => (
                    <li key={skill.id}>{skill.name}</li>
                  ))}
                </ul>
              </div>
            )}
            {backendSkills > 0 && (
              <div className="professional-skill-column">
                <h4>Backend</h4>
                <ul>
                  {skills.filter(s => s.category === "backend").map(skill => (
                    <li key={skill.id}>{skill.name}</li>
                  ))}
                </ul>
              </div>
            )}
            {toolsSkills > 0 && (
              <div className="professional-skill-column">
                <h4>Tools & Platforms</h4>
                <ul>
                  {skills.filter(s => s.category === "tools").map(skill => (
                    <li key={skill.id}>{skill.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {projects.length > 0 && (
        <section className="professional-projects-section">
          <h3>Notable Projects</h3>
          <div className="professional-projects-table">
            {projects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}

      {profile.location && (
        <footer className="professional-footer">
          <p>Location: {profile.location}</p>
          {profile.is_pro && <p>Verified Professional Portfolio</p>}
        </footer>
      )}
    </div>
  );
}

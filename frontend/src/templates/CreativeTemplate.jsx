import ProfileDetailsSection from "../components/ProfileDetailsSection";

function ProjectCard({ project }) {
  return (
    <article className="creative-project-card">
      {project.screenshot_url && (
        <div className="creative-project-image">
          <img src={project.screenshot_url} alt={project.title} />
        </div>
      )}
      <div className="creative-project-content">
        <h4>{project.title}</h4>
        <p>{project.description}</p>
        {project.tech_stack?.length && (
          <div className="creative-tech-tags">
            {project.tech_stack.map((tech, idx) => (
              <span key={idx} className="creative-tag">{tech}</span>
            ))}
          </div>
        )}
        <div className="creative-project-links">
          {project.live_url && (
            <a href={project.live_url} target="_blank" rel="noreferrer" className="creative-link">→ Live</a>
          )}
          {project.repo_url && (
            <a href={project.repo_url} target="_blank" rel="noreferrer" className="creative-link">→ Code</a>
          )}
        </div>
      </div>
    </article>
  );
}

export default function CreativeTemplate({ data, mode = "public" }) {
  const { profile, projects, skills } = data;
  const isPreview = mode === "preview";
  const skillCategories = [...new Set(skills.map(s => s.category))];

  return (
    <div className={`template-shell template-creative-shell ${isPreview ? "is-preview" : ""}`}>
      <header className="template-hero template-hero-creative">
        <div className="creative-hero-content">
          <span className="eyebrow creative-eyebrow">Creative</span>
          <h1 className="creative-title">{profile.full_name || profile.username || "Your Name"}</h1>
          {profile.title && <h2 className="creative-subtitle">{profile.title}</h2>}
          {profile.bio && <p className="creative-bio">{profile.bio}</p>}
          {profile.location && <p className="creative-location">📍 {profile.location}</p>}
          <div className="creative-badges">
            {profile.is_pro && <span className="pro-badge creative-pro">PRO</span>}
          </div>
        </div>
      </header>

      <ProfileDetailsSection profile={profile} />

      {skills.length > 0 && (
        <section className="creative-skills-section">
          <h3>Expertise</h3>
          <div className="creative-skills-grid">
            {skillCategories.map(category => (
              <div key={category} className="creative-skill-group">
                <h4>{category}</h4>
                <div className="creative-skill-list">
                  {skills.filter(s => s.category === category).map(skill => (
                    <span key={skill.id} className="creative-skill-badge">{skill.name}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {projects.length > 0 && (
        <section className="creative-projects-section">
          <h3>Featured Work</h3>
          <div className="creative-projects-grid">
            {projects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

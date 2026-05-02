import ProfileDetailsSection from "../components/ProfileDetailsSection";

function ProjectCard({ project }) {
  return (
    <article className="artistic-project-card">
      {project.screenshot_url && (
        <div className="artistic-project-image">
          <img src={project.screenshot_url} alt={project.title} />
          <div className="artistic-project-overlay">
            <div className="artistic-project-content">
              <h4>{project.title}</h4>
              <p>{project.description}</p>
              {project.tech_stack?.length && (
                <div className="artistic-tech-inline">
                  {project.tech_stack.join(" • ")}
                </div>
              )}
              <div className="artistic-project-links">
                {project.live_url && (
                  <a href={project.live_url} target="_blank" rel="noreferrer">Live</a>
                )}
                {project.repo_url && (
                  <a href={project.repo_url} target="_blank" rel="noreferrer">Code</a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {!project.screenshot_url && (
        <div className="artistic-project-noimage">
          <h4>{project.title}</h4>
          <p>{project.description}</p>
          {project.tech_stack?.length && (
            <div className="artistic-tech-inline">
              {project.tech_stack.join(" • ")}
            </div>
          )}
        </div>
      )}
    </article>
  );
}

export default function ArtisticTemplate({ data, mode = "public" }) {
  const { profile, projects, skills } = data;
  const isPreview = mode === "preview";
  const skillCategories = [...new Set(skills.map(s => s.category))];

  return (
    <div className={`template-shell template-artistic-shell ${isPreview ? "is-preview" : ""}`}>
      <header className="template-hero template-hero-artistic">
        <div className="artistic-hero-wrapper">
          <div className="artistic-hero-content">
            <span className="eyebrow artistic-eyebrow">Portfolio</span>
            <h1 className="artistic-title">{profile.full_name || profile.username || "Your Name"}</h1>
            {profile.title && <h2 className="artistic-subtitle">{profile.title}</h2>}
          </div>
          <div className="artistic-hero-accent"></div>
        </div>
        {profile.bio && <p className="artistic-bio">{profile.bio}</p>}
        <div className="artistic-hero-meta">
          {profile.location && <span>📍 {profile.location}</span>}
          {profile.is_pro && <span className="pro-badge artistic-pro">Professional</span>}
        </div>
      </header>

      <ProfileDetailsSection profile={profile} />

      {skills.length > 0 && (
        <section className="artistic-skills-section">
          <h3>Capabilities</h3>
          <div className="artistic-skills-flex">
            {skillCategories.map(category => (
              <div key={category} className="artistic-skill-group">
                <span className="artistic-category-label">{category}</span>
                <div className="artistic-skill-collection">
                  {skills.filter(s => s.category === category).map(skill => (
                    <span key={skill.id} className="artistic-skill">{skill.name}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {projects.length > 0 && (
        <section className="artistic-projects-section">
          <h3>Showcased Work</h3>
          <div className="artistic-projects-gallery">
            {projects.map((project, idx) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

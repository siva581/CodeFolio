import ProfileDetailsSection from "../components/ProfileDetailsSection";

function ProjectCard({ project }) {
  return (
    <article className="designer-project-card">
      {project.screenshot_url && (
        <div className="designer-project-image">
          <img src={project.screenshot_url} alt={project.title} />
        </div>
      )}
      <div className="designer-project-info">
        <h4>{project.title}</h4>
        <p>{project.description}</p>
        {project.tech_stack?.length && (
          <div className="designer-tech-chips">
            {project.tech_stack.map((tech, idx) => (
              <span key={idx}>{tech}</span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

export default function DesignerTemplate({ data, mode = "public" }) {
  const { profile, projects, skills } = data;
  const isPreview = mode === "preview";
  const skillCategories = [...new Set(skills.map(s => s.category))];

  return (
    <div className={`template-shell template-designer-shell ${isPreview ? "is-preview" : ""}`}>
      <header className="template-hero template-hero-designer">
        <div className="designer-hero-grid">
          <div className="designer-profile-section">
            <span className="eyebrow designer-eyebrow">Portfolio</span>
            <h1 className="designer-name">{profile.full_name || profile.username || "Your Name"}</h1>
            {profile.title && <h2 className="designer-role">{profile.title}</h2>}
            {profile.bio && <p className="designer-bio">{profile.bio}</p>}
          </div>
          <div className="designer-stats">
            <div className="designer-stat">
              <span className="designer-stat-value">{projects.length}</span>
              <span className="designer-stat-label">Projects</span>
            </div>
            <div className="designer-stat">
              <span className="designer-stat-value">{skills.length}</span>
              <span className="designer-stat-label">Skills</span>
            </div>
            {profile.is_pro && (
              <div className="designer-stat">
                <span className="pro-badge designer-pro">PRO</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <ProfileDetailsSection profile={profile} />

      {skills.length > 0 && (
        <section className="designer-skills-section">
          <h3>Skillset</h3>
          <div className="designer-skills-categories">
            {skillCategories.map(category => (
              <div key={category} className="designer-skill-category">
                <h4>{category}</h4>
                <div className="designer-skills-cloud">
                  {skills.filter(s => s.category === category).map(skill => (
                    <span key={skill.id} className="designer-skill-item">{skill.name}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {projects.length > 0 && (
        <section className="designer-projects-section">
          <h3>Selected Work</h3>
          <div className="designer-projects-masonry">
            {projects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}

      {profile.location && (
        <footer className="designer-footer">
          <p>📍 Based in {profile.location}</p>
        </footer>
      )}
    </div>
  );
}

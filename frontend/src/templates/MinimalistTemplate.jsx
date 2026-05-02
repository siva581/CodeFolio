import ProfileDetailsSection from "../components/ProfileDetailsSection";

function SkillPill({ skill }) {
  return (
    <span className="skill-pill">
      {skill.name}
      <small>({skill.category})</small>
    </span>
  );
}

function ProjectCard({ project }) {
  return (
    <article className="portfolio-item">
      <div className="portfolio-item-head">
        <strong>{project.title}</strong>
        {project.live_url && (
          <a href={project.live_url} target="_blank" rel="noreferrer">
            Live
          </a>
        )}
      </div>
      <p>{project.description}</p>
      {project.tech_stack?.length ? <small>{project.tech_stack.join(" • ")}</small> : null}
      {project.repo_url && (
        <a href={project.repo_url} target="_blank" rel="noreferrer">
          Code
        </a>
      )}
    </article>
  );
}

export default function MinimalistTemplate({ data, mode = "public" }) {
  const { profile, projects, skills } = data;
  const isPreview = mode === "preview";

  return (
    <div className={`template-shell template-minimal-shell ${isPreview ? "is-preview" : ""}`}>
      <header className="template-hero template-hero-minimal">
        <div>
          <span className="eyebrow">Minimalist</span>
          <h1>{profile.full_name || profile.username || "Your Name"}</h1>
          {profile.title && <h2>{profile.title}</h2>}
          {profile.bio && <p>{profile.bio}</p>}
          {profile.location && <p><strong>Location:</strong> {profile.location}</p>}
        </div>
        <div className="template-badges">
          {profile.is_pro && <span className="pro-badge">PRO USER</span>}
          {profile.custom_domain && <span className="domain-pill">{profile.custom_domain}</span>}
        </div>
      </header>

      <ProfileDetailsSection profile={profile} />

      <section>
        <h3>Skills</h3>
        <div className="skill-cloud">
          {skills.length ? skills.map((skill) => <SkillPill key={skill.id} skill={skill} />) : <p className="empty-state">Add your core skill tags here.</p>}
        </div>
      </section>

      <section>
        <h3>Projects</h3>
        <div className="portfolio-list">
          {projects.length ? projects.map((project) => <ProjectCard key={project.id} project={project} />) : <p className="empty-state">Your best projects will show up here.</p>}
        </div>
      </section>
    </div>
  );
}
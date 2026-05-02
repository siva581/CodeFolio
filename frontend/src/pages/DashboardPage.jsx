import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { apiRequest } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import LivePortfolioPreview from "../components/LivePortfolioPreview";

const EMPTY_PROFILE = {
  username: "",
  full_name: "",
  title: "",
  bio: "",
  location: "",
  avatar_url: "",
  resume_url: "",
  email_public: "",
  github_url: "",
  linkedin_url: "",
  twitter_url: "",
  website_url: "",
  custom_domain: "",
  template_id: "minimalist",
};

const EMPTY_PROJECT = {
  title: "",
  description: "",
  tech_stack: "",
  repo_url: "",
  live_url: "",
  screenshot_url: "",
};
const EMPTY_SKILL = { name: "", category: "frontend" };

function normalizeProfile(profile = {}) {
  return {
    ...EMPTY_PROFILE,
    ...profile,
    username: profile.username ?? "",
    full_name: profile.full_name ?? "",
    title: profile.title ?? "",
    bio: profile.bio ?? "",
    location: profile.location ?? "",
    avatar_url: profile.avatar_url ?? "",
    resume_url: profile.resume_url ?? "",
    email_public: profile.email_public ?? "",
    github_url: profile.github_url ?? "",
    linkedin_url: profile.linkedin_url ?? "",
    twitter_url: profile.twitter_url ?? "",
    website_url: profile.website_url ?? "",
    custom_domain: profile.custom_domain ?? "",
    template_id: profile.template_id ?? "minimalist",
  };
}

export default function DashboardPage() {
  const { token } = useAuth();
  const [portfolioUser, setPortfolioUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const profileForm = useForm({ defaultValues: EMPTY_PROFILE });
  const projectForm = useForm({ defaultValues: EMPTY_PROJECT });
  const skillForm = useForm({ defaultValues: EMPTY_SKILL });

  const profileValues = profileForm.watch();
  const profile = useMemo(() => normalizeProfile(profileValues), [profileValues]);
  const publicUrl = useMemo(() => `/u/${profile.username}`, [profile.username]);
  const profileCompletion = [
    profile.full_name,
    profile.title,
    profile.bio,
    profile.location,
    profile.resume_url,
    profile.github_url,
    profile.linkedin_url,
    profile.website_url,
    profile.custom_domain,
  ].filter(Boolean).length;
  const previewData = useMemo(
    () => ({ user: portfolioUser || { templateId: profile.template_id }, profile, projects, skills }),
    [portfolioUser, profile, projects, skills],
  );

  useEffect(() => {
    async function loadPortfolio() {
      try {
        const data = await apiRequest("/api/portfolio/me", { token });
        setPortfolioUser(data.user || null);
        profileForm.reset(normalizeProfile(data.profile));
        setProjects(data.projects || []);
        setSkills(data.skills || []);
      } catch (err) {
        setMessage(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadPortfolio();
  }, [token, profileForm]);

  async function saveProfile(values) {
    setMessage("");
    try {
      const data = await apiRequest("/api/portfolio/me/profile", {
        method: "PUT",
        token,
        body: normalizeProfile(values),
      });
      profileForm.reset(normalizeProfile(data.profile));
      setMessage("Profile saved.");
    } catch (err) {
      setMessage(err.message);
    }
  }

  async function addProject(values) {
    const techStack = values.tech_stack
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    try {
      const data = await apiRequest("/api/portfolio/me/projects", {
        method: "POST",
        token,
        body: {
          title: values.title,
          description: values.description,
          tech_stack: techStack,
          repo_url: values.repo_url,
          live_url: values.live_url,
          screenshot_url: values.screenshot_url,
          position: projects.length,
        },
      });
      setProjects((prev) => [...prev, data.project]);
      projectForm.reset(EMPTY_PROJECT);
      setMessage("Project added.");
    } catch (err) {
      setMessage(err.message);
    }
  }

  async function deleteProject(projectId) {
    try {
      await apiRequest(`/api/portfolio/me/projects/${projectId}`, { method: "DELETE", token });
      setProjects((prev) => prev.filter((project) => project.id !== projectId));
      setMessage("Project deleted.");
    } catch (err) {
      setMessage(err.message);
    }
  }

  async function addSkill(values) {
    try {
      const data = await apiRequest("/api/portfolio/me/skills", {
        method: "POST",
        token,
        body: {
          name: values.name,
          category: values.category,
          position: skills.length,
        },
      });
      setSkills((prev) => [...prev, data.skill]);
      skillForm.reset(EMPTY_SKILL);
      setMessage("Skill added.");
    } catch (err) {
      setMessage(err.message);
    }
  }

  async function deleteSkill(skillId) {
    try {
      await apiRequest(`/api/portfolio/me/skills/${skillId}`, { method: "DELETE", token });
      setSkills((prev) => prev.filter((skill) => skill.id !== skillId));
      setMessage("Skill deleted.");
    } catch (err) {
      setMessage(err.message);
    }
  }

  if (loading) return <p className="center-message">Loading dashboard...</p>;

  return (
    <div className="dashboard-shell reveal">
      <section className="dashboard-highlights stagger">
        <article className="card metric-card">
          <small>Projects</small>
          <strong>{projects.length}</strong>
          <span>Published entries</span>
        </article>
        <article className="card metric-card">
          <small>Skills</small>
          <strong>{skills.length}</strong>
          <span>Stack categories ready</span>
        </article>
        <article className="card metric-card">
          <small>Profile score</small>
          <strong>{Math.min(100, Math.round((profileCompletion / 8) * 100))}%</strong>
          <span>Fill more fields to improve</span>
        </article>
      </section>

      <div className="dashboard-workspace">
        <div className="dashboard-grid stagger">
          <section className="card dashboard-panel profile-panel">
            <h2>Profile</h2>
            <form onSubmit={profileForm.handleSubmit(saveProfile)} className="form-grid profile-form">
              <label>Username<input placeholder="your-username" {...profileForm.register("username")} /></label>
              <label>Full Name<input placeholder="Jane Doe" {...profileForm.register("full_name")} /></label>
              <label>Title<input placeholder="Senior Developer" {...profileForm.register("title")} /></label>
              <label>Bio<textarea placeholder="A short bio about you — interests, skills, focus areas." {...profileForm.register("bio")} /></label>
              <label>Location<input placeholder="City, Country" {...profileForm.register("location")} /></label>
              <label>Resume URL<input placeholder="https://example.com/resume.pdf" {...profileForm.register("resume_url")} /></label>
              <label>Public Email<input placeholder="me@example.com" {...profileForm.register("email_public")} /></label>
              <label>GitHub URL<input placeholder="https://github.com/yourusername" {...profileForm.register("github_url")} /></label>
              <label>LinkedIn URL<input placeholder="https://linkedin.com/in/yourprofile" {...profileForm.register("linkedin_url")} /></label>
              <label>Twitter URL<input placeholder="https://twitter.com/yourhandle" {...profileForm.register("twitter_url")} /></label>
              <label>Website URL<input placeholder="https://your-website.com" {...profileForm.register("website_url")} /></label>
              <label>Custom Domain<input placeholder="john.com" {...profileForm.register("custom_domain")} /></label>
              <label>
                Template
                <select {...profileForm.register("template_id")}>
                  <option value="minimalist">Minimalist</option>
                  <option value="corporate">Corporate</option>
                  <option value="creative">Creative</option>
                  <option value="dark">Dark (Developer)</option>
                  <option value="designer">Designer</option>
                  <option value="startup">Startup</option>
                  <option value="professional">Professional</option>
                  <option value="artistic">Artistic</option>
                  <option value="cyberpunk">Cyberpunk</option>
                  <option value="material">Material</option>
                </select>
              </label>
              <button type="submit" className="btn">Save Profile</button>
            </form>
          </section>

          <section className="card dashboard-panel">
            <h2>Projects</h2>
            <form onSubmit={projectForm.handleSubmit(addProject)} className="form-grid">
              <label>Title<input placeholder="Project title" {...projectForm.register("title", { required: true })} /></label>
              <label>Description<textarea placeholder="Brief project description and your role" {...projectForm.register("description")} /></label>
              <label>Tech Stack (comma separated)<input placeholder="React, Node.js, MongoDB" {...projectForm.register("tech_stack")} /></label>
              <label>Repo URL<input placeholder="https://github.com/yourusername/project" {...projectForm.register("repo_url")} /></label>
              <label>Live URL<input placeholder="https://project-demo.com" {...projectForm.register("live_url")} /></label>
              <label>Screenshot URL<input placeholder="https://images.example.com/project.png" {...projectForm.register("screenshot_url")} /></label>
              <button type="submit" className="btn">Add Project</button>
            </form>
            <ul className="list content-list">
              {projects.map((project) => (
                <li key={project.id} className="content-list-item">
                  <strong>{project.title}</strong>
                  <p>{project.description}</p>
                  {project.tech_stack?.length ? <small>{project.tech_stack.join(", ")}</small> : null}
                  <div className="actions-row">
                    {project.live_url ? (
                      <a href={project.live_url} target="_blank" rel="noreferrer" className="btn">
                        Live
                      </a>
                    ) : null}
                    {project.repo_url ? (
                      <a href={project.repo_url} target="_blank" rel="noreferrer" className="btn">
                        Code
                      </a>
                    ) : null}
                  </div>
                  <div className="actions-row">
                    <button type="button" className="btn btn-danger" onClick={() => deleteProject(project.id)}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="card dashboard-panel">
            <h2>Skills</h2>
            <form onSubmit={skillForm.handleSubmit(addSkill)} className="form-grid">
              <label>Skill Name<input placeholder="HTML, CSS, React" {...skillForm.register("name", { required: true })} /></label>
              <label>
                Category
                <select {...skillForm.register("category")}>
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend</option>
                  <option value="devops">DevOps</option>
                  <option value="tools">Tools</option>
                </select>
              </label>
              <button type="submit" className="btn">Add Skill</button>
            </form>
            <ul className="list content-list">
              {skills.map((skill) => (
                <li key={skill.id} className="content-list-item skill-item">
                  <strong>{skill.name}</strong> <small>({skill.category})</small>
                  <button type="button" className="btn btn-danger" onClick={() => deleteSkill(skill.id)}>Delete</button>
                </li>
              ))}
            </ul>
          </section>

          <section className="card dashboard-panel share-panel">
            <h2>Public URL</h2>
            <p>Share your portfolio at:</p>
            <Link to={publicUrl} className="btn" style={{ display: "inline-block", textDecoration: "none" }}>
              {publicUrl}
            </Link>
          </section>

          {message && <p className="info-text">{message}</p>}
        </div>

        <aside className="dashboard-preview-shell">
          <LivePortfolioPreview data={previewData} />
        </aside>
      </div>
    </div>
  );
}

function normalizeUrl(value) {
  const trimmed = String(value || "").trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export default function ProfileDetailsSection({ profile }) {
  if (!profile) return null;

  const details = [
    { label: "Location", value: profile.location || "" },
    {
      label: "Public Email",
      value: profile.email_public || "",
      href: profile.email_public ? `mailto:${String(profile.email_public).trim()}` : null,
    },
    { label: "Resume URL", value: profile.resume_url || "", href: normalizeUrl(profile.resume_url) },
    { label: "GitHub URL", value: profile.github_url || "", href: normalizeUrl(profile.github_url) },
    { label: "LinkedIn URL", value: profile.linkedin_url || "", href: normalizeUrl(profile.linkedin_url) },
    { label: "Twitter URL", value: profile.twitter_url || "", href: normalizeUrl(profile.twitter_url) },
    { label: "Website URL", value: profile.website_url || "", href: normalizeUrl(profile.website_url) },
    { label: "Custom Domain", value: profile.custom_domain || "", href: normalizeUrl(profile.custom_domain) },
  ].filter((item) => String(item.value).trim().length > 0);

  if (!details.length) return null;

  return (
    <section className="profile-details-panel" aria-label="Professional details">
      <h3>Professional Details</h3>
      <div className="profile-details-grid">
        {details.map((item) => (
          <article className="profile-detail-item" key={item.label}>
            <span className="profile-detail-label">{item.label}</span>
            {item.href ? (
              <a href={item.href} target="_blank" rel="noreferrer" className="profile-detail-value">
                {item.value}
              </a>
            ) : (
              <span className="profile-detail-value">{item.value}</span>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
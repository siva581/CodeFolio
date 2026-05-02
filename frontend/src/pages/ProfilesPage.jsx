import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function ProfilesPage() {
  const { token, user, isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProfiles() {
      try {
        const data = await apiRequest("/api/portfolio/all");
        if (active) setProfiles(data.profiles || []);
      } catch (err) {
        if (active) setError(err.message || "Could not load profiles");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProfiles();

    return () => {
      active = false;
    };
  }, []);

  async function deleteProfile(profileId) {
    const confirmed = window.confirm("Delete your profile and all related projects/skills? This cannot be undone.");
    if (!confirmed) return;

    try {
      await apiRequest("/api/portfolio/me/profile", {
        method: "DELETE",
        token,
      });

      setProfiles((prev) => prev.filter((profile) => profile.id !== profileId));

      if (user?.id === profileId) {
        signOut();
        navigate("/auth");
      }
    } catch (err) {
      setError(err.message || "Could not delete profile");
    }
  }

  if (loading) return <p className="center-message">Loading saved profiles...</p>;
  if (error) return <p className="center-message error-text">{error}</p>;

  return (
    <section className="dashboard-shell reveal">
      <div className="card dashboard-panel">
        <h2>Saved Profiles</h2>
        <p>These are the profiles currently saved in the app.</p>
      </div>

      <div className="dashboard-grid stagger" style={{ marginTop: "1.5rem" }}>
        {profiles.length === 0 ? (
          <div className="card dashboard-panel">
            <p>No profiles saved yet.</p>
          </div>
        ) : (
          profiles.map((profile) => (
            <article key={profile.id} className="card dashboard-panel">
              <h3>{profile.full_name || profile.username}</h3>
              <p>@{profile.username}</p>
              {profile.title ? <p>{profile.title}</p> : null}
              {profile.bio ? <p>{profile.bio}</p> : null}
              <div className="actions-row">
                <Link to={profile.public_url} className="btn" style={{ display: "inline-block", textDecoration: "none" }}>
                  View Profile
                </Link>
                {isAuthenticated && user?.id === profile.id ? (
                  <button type="button" className="btn btn-danger" onClick={() => deleteProfile(profile.id)}>
                    Delete Profile
                  </button>
                ) : null}
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
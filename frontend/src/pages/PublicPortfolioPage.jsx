import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { apiRequest } from "../lib/api";
import PortfolioLayout from "../components/PortfolioLayout";
import ContactForm from "../components/ContactForm";

export default function PublicPortfolioPage() {
  const { username } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const isLocalHost = useMemo(() => {
    if (typeof window === "undefined") return true;
    const hostname = window.location.hostname;
    return hostname === "localhost" || hostname === "127.0.0.1" || hostname.endsWith(".localhost");
  }, []);

  useEffect(() => {
    let active = true;

    async function loadPortfolio() {
      try {
        const payload = username
          ? await apiRequest(`/api/portfolio/${encodeURIComponent(username)}`)
          : await apiRequest(`/api/portfolio/domain/${encodeURIComponent(window.location.hostname.toLowerCase())}`);

        if (active) setData(payload);
      } catch (err) {
        if (active) setError(err.message);
      }
    }

    loadPortfolio();

    return () => {
      active = false;
    };
  }, [username, isLocalHost]);

  if (error) return <p className="center-message error-text">{error}</p>;
  if (!data) return <p className="center-message">Loading portfolio...</p>;

  const profile = data.profile;
  const pageTitle = `${profile.full_name || profile.username} | CodeFolio`;
  const metaDescription = profile.bio || profile.title || `Portfolio of ${profile.full_name || profile.username}`;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
      </Helmet>

      <section className="portfolio-page-shell">
        <PortfolioLayout data={data} mode="public" />
        <ContactForm recipientId={profile.id} />
      </section>
    </>
  );
}

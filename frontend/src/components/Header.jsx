import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Header() {
  const { isAuthenticated, user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function onLogout() {
    signOut();
    setMobileMenuOpen(false);
    navigate("/");
  }

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  return (
    <header className="site-header">
      <div className="container nav-row">
        <Link to="/" className="brand" onClick={closeMobileMenu}>CodeFolio</Link>
        
        {/* Hamburger Menu Button */}
        <button 
          type="button" 
          className="hamburger-menu"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>

        {/* Navigation Links */}
        <nav className={`nav-links ${mobileMenuOpen ? "mobile-open" : ""}`}>
          <Link to="/" onClick={closeMobileMenu}>Home</Link>
          <Link to="/profiles" onClick={closeMobileMenu}>Profiles</Link>
          <Link to="/u/demo1" onClick={closeMobileMenu}>Demo</Link>
          <Link to="/premium" onClick={closeMobileMenu}>Premium</Link>
          {isAuthenticated && <Link to="/dashboard" onClick={closeMobileMenu}>Dashboard</Link>}
          {!isAuthenticated && <Link to="/auth" onClick={closeMobileMenu}>Login</Link>}
          
          <button type="button" onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          
          {isAuthenticated ? (
            <>
              <span className="user-pill">{user?.name || user?.email}</span>
              <button type="button" onClick={onLogout} className="btn btn-ghost">Logout</button>
            </>
          ) : null}
        </nav>
      </div>
    </header>
  );
}

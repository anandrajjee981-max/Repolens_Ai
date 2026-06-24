import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/navbar.scss';

const Navbar = () => {
  const [activeLink, setActiveLink] = useState('Home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Link titles mapping with respective element IDs
  const navItems = [
    { name: 'Home', target: 'home' },
    { name: 'Features', target: 'features' },
    { name: 'Tech Stack', target: 'thanks' }
  ];

  // Pure dynamic smooth scroll logic for same-page anchors
  const handleNavClick = (e, targetId, itemName) => {
    e.preventDefault(); 
    setActiveLink(itemName);
    setIsMenuOpen(false); 

    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Centralized CTA action
  const handleGetStarted = () => {
    setIsMenuOpen(false);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar__container">
        
        {/* --- Logo --- */}
        <div 
          className="navbar__logo" 
          onClick={(e) => handleNavClick(e, 'home', 'Home')}
        >
          <div className="navbar__logo-box">
            <svg className="navbar__logo-svg" viewBox="0 0 24 24" fill="none">
              <path d="M7 2H2V7" stroke="#a855f7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M17 2H22V7" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 22H2V17" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M17 22H22V17" stroke="#a855f7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="12" r="3" fill="#ffffff" className="navbar__logo-core" />
            </svg>
          </div>
          <span className="navbar__logo-text">REPOLENS</span>
        </div>

        {/* --- Desktop Navigation --- */}
        <div className="navbar__links-center">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={`#${item.target}`}
              className={`navbar__link ${activeLink === item.name ? 'navbar__link--active' : ''}`}
              onClick={(e) => handleNavClick(e, item.target, item.name)}
            >
              {item.name}
            </a>
          ))}
        </div>

        {/* --- Desktop CTA Button --- */}
        <div className="navbar__actions-right">
          <button 
            className="navbar__btn-primary" 
            onClick={handleGetStarted}
          >
            <span>Get Started</span>
            <svg className="navbar__arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>

        {/* --- Responsive Menu Hamburger --- */}
        <button 
          className={`navbar__hamburger ${isMenuOpen ? 'navbar__hamburger--open' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Navigation"
        >
          <span className="navbar__hamburger-line"></span>
          <span className="navbar__hamburger-line"></span>
        </button>

        {/* --- Mobile Drawer Overlay --- */}
        <div className={`navbar__mobile-drawer ${isMenuOpen ? 'navbar__mobile-drawer--open' : ''}`}>
          <div className="navbar__mobile-links">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={`#${item.target}`}
                className={`navbar__mobile-link ${activeLink === item.name ? 'navbar__mobile-link--active' : ''}`}
                onClick={(e) => handleNavClick(e, item.target, item.name)}
              >
                {item.name}
              </a>
            ))}
            <button 
              className="navbar__mobile-btn" 
              onClick={handleGetStarted}
            >
              <span>Get Started</span>
            </button>
          </div>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
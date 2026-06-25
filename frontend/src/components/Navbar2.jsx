import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import '../style/navbar2.scss';

const Navbar2 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navRef = useRef(null);
  const labelsRef = useRef([]);
  const mobileMenuRef = useRef(null);
  
  // Timelines ko cache karne ke liye refs
  const desktopTl = useRef(null);
  const mobileTl = useRef(null);

  const currentPath = location.pathname === '/' ? '/dashboard' : location.pathname;
  const isActive = (path) => currentPath === path;

  // --- ANIMATION INITIALIZATION (Runs only once on mount) ---
  useEffect(() => {
    // Desktop Timeline: Pre-built in memory for instant execution on hover
    desktopTl.current = gsap.timeline({ paused: true })
      .to(navRef.current, { width: '220px', duration: 0.25, ease: 'power2.out' }, 0)
      .to(labelsRef.current, { 
        opacity: 1, 
        x: 0, 
        duration: 0.2, 
        stagger: 0.02, 
        ease: 'power1.out' 
      }, 0.05);

    // Mobile Timeline: Smooth vertical dropdown sequence
    if (mobileMenuRef.current) {
      mobileTl.current = gsap.timeline({ paused: true })
        .to(mobileMenuRef.current, { y: 0, opacity: 1, duration: 0.3, ease: 'power3.out' });
    }

    return () => {
      if (desktopTl.current) desktopTl.current.kill();
      if (mobileTl.current) mobileTl.current.kill();
    };
  }, []);

  // --- MOBILE MENUBAR TRIGGER SYNC ---
  useEffect(() => {
    if (window.innerWidth <= 768 && mobileTl.current) {
      if (isMobileMenuOpen) {
        mobileMenuRef.current.classList.add('is-visible');
        mobileTl.current.play();
      } else {
        mobileTl.current.reverse().then(() => {
          mobileMenuRef.current.classList.remove('is-visible');
        });
      }
    }
  }, [isMobileMenuOpen]);

  // --- DESKTOP HOVER HANDLERS ---
  const handleMouseEnter = () => {
    if (window.innerWidth > 768 && desktopTl.current) {
      desktopTl.current.play();
    }
  };

  const handleMouseLeave = () => {
    if (window.innerWidth > 768 && desktopTl.current) {
      desktopTl.current.reverse();
    }
  };

  const handleNavigation = (targetPath) => {
    if (currentPath !== targetPath) {
      navigate(targetPath);
    }
    setIsMobileMenuOpen(false); 
  };

  return (
    <nav 
      className="terminal-nav" 
      ref={navRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="terminal-nav__top-wrapper">
        <div className="terminal-nav__brand" onClick={() => handleNavigation('/dashboard')}>
          <div className="navbar__logo-box">
            <svg className="navbar__logo-svg" viewBox="0 0 24 24" fill="none">
              <path d="M7 2H2V7" stroke="#a855f7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M17 2H22V7" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 22H2V17" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M17 22H22V17" stroke="#a855f7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="12" r="3" fill="#ffffff" className="navbar__logo-core" />
            </svg>
          </div>
          <span className="brand-text" ref={(el) => (labelsRef.current[0] = el)}>
            REPOLENS
          </span>
        </div>

        <div 
          className={`hamburger-trigger ${isMobileMenuOpen ? 'hamburger-trigger--open' : ''}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span className="line"></span>
          <span className="line"></span>
          <span className="line"></span>
        </div>
      </div>

      <div className="terminal-nav__menu" ref={mobileMenuRef}>
        
        {/* Dashboard Menu Button */}
        <div 
          className={`nav-item ${isActive('/dashboard') ? 'nav-item--active' : ''}`}
          onClick={() => handleNavigation('/dashboard')}
        >
          <div className="nav-item__icon-wrapper">
            <svg className="nav-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M9 3v18" />
              <path d="M3 9h18" />
            </svg>
          </div>
          <span className="nav-item__label" ref={(el) => (labelsRef.current[1] = el)}>
            DASHBOARD HUB
          </span>
          <div className="nav-item__indicator"></div>
        </div>

        {/* Data Library Menu Button */}
        <div 
          className={`nav-item ${isActive('/library') ? 'nav-item--active' : ''}`}
          onClick={() => handleNavigation('/library')}
        >
          <div className="nav-item__icon-wrapper">
            <svg className="nav-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
              <path d="M12 6v6l4 2" />
              <path d="M16 21.12c-1.22.56-2.58.88-4 .88-5.52 0-10-4.48-10-10S6.48 2 12 2s10 4.48 10 10c0 1.42-.32 2.78-.88 4" />
            </svg>
          </div>
          <span className="nav-item__label" ref={(el) => (labelsRef.current[2] = el)}>
            DATA ARCHIVES
          </span>
          <div className="nav-item__indicator"></div>
        </div>

      </div>

      <div className="terminal-nav__status">
        <div className="status-node"></div>
      </div>
    </nav>
  );
};

export default Navbar2;
import React, { useEffect, useState, useRef } from 'react';
import Navbar2 from '../../components/Navbar2';
import useRepo from './hooks/userepo'; 
import { gsap } from 'gsap';
import '../../style/data.scss';

// 5 Techy Space/Cosmic Abstract Stock Vectors for randomized backgrounds
const CYBER_CORES = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop", // Quantum mesh
  "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=600&auto=format&fit=crop", // Purple nebula structure
  "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=600&auto=format&fit=crop", // Tech matrix wires
  "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600&auto=format&fit=crop", // Dark cyber gate
  "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=600&auto=format&fit=crop"  // Deep aurora plasma
];

const Data = () => {
  const { handlegetrepocard } = useRepo(); 
  const [repoCards, setRepoCards] = useState([]);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await handlegetrepocard(); 
        if (res && res.repocard) {
          // Enhancing data structure directly by mapping random background index slots
          const enrichedData = res.repocard.map((card, idx) => ({
            ...card,
            bgImage: CYBER_CORES[idx % CYBER_CORES.length]
          }));
          setRepoCards(enrichedData);
        }
      } catch (err) {
        console.error("Error loading vault streams:", err);
      } finally {
        setIsPageLoading(false);
      }
    };
    fetchCards();
  }, []);

  // 1. Entrance Stagger Animation Node Engine
  useEffect(() => {
    if (repoCards.length > 0) {
      const ctx = gsap.context(() => {
        gsap.fromTo('.quantum-tech-card',
          { opacity: 0, y: 40, transformPerspective: 1000, rotateX: -15, scale: 0.93 },
          { opacity: 1, y: 0, rotateX: 0, scale: 1, duration: 0.8, ease: 'power4.out', stagger: 0.12 }
        );
      }, containerRef);
      return () => ctx.revert();
    }
  }, [repoCards]);

  // 2. High-End GSAP 3D Interactive Tilt Handler
  const handleMouseMove = (e, cardId) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    
    // Normalize axis ratios for precision tilt rotation matrix
    const rotX = -(y / (box.height / 2)) * 10; 
    const rotY = (x / (box.width / 2)) * 10;

    gsap.to(card, {
      rotateX: rotX,
      rotateY: rotY,
      transformPerspective: 800,
      scale: 1.02,
      boxShadow: `0 30px 60px rgba(0,0,0,0.7), 0 0 25px rgba(59, 130, 246, 0.2)`,
      duration: 0.3,
      ease: 'power2.out'
    });

    // Animate the inside glowing flare following cursor track positioning
    const flare = card.querySelector('.cursor-flare-tracker');
    if (flare) {
      gsap.to(flare, {
        x: e.clientX - box.left - 50,
        y: e.clientY - box.top - 50,
        opacity: 1,
        duration: 0.2
      });
    }
  };

  const handleMouseLeave = (e) => {
    const card = e.currentTarget;
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      boxShadow: '0 15px 35px rgba(0, 0, 0, 0.4)',
      duration: 0.5,
      ease: 'power3.out'
    });

    const flare = card.querySelector('.cursor-flare-tracker');
    if (flare) gsap.to(flare, { opacity: 0, duration: 0.4 });
  };

  return (
    <div className="vault-page-container" ref={containerRef}>
      <Navbar2 />
      
      <div className="vault-ambient glow-primary"></div>
      <div className="vault-ambient glow-secondary"></div>

      <main className="vault-viewport">
        <div className="vault-wrapper">
          
          {/* Header Layout Status Checkpoint */}
          <div className="vault-header-block quantum-tech-card">
            <div className="title-area">
              <div className="system-live-pulse">
                <span className="pulse-ping"></span>
                <span className="pulse-dot"></span>
                <p>DATAFRAME // SECURE</p>
              </div>
              <h1>Repository <span>History</span></h1>
             
            </div>
            <div className="vault-count-badge">
              <span>ACTIVE_CORES // 00{repoCards.length}</span>
            </div>
          </div>

          {/* Conditional Layout Gateways */}
          {isPageLoading ? (
            <div className="vault-sync-loader">
              <div className="matrix-spinner"></div>
              <p>LOADING SYSTEM REGISTRIES...</p>
            </div>
          ) : repoCards.length === 0 ? (
            <div className="vault-empty-state quantum-tech-card">
              <p>No active architecture vectors cataloged in this sector.</p>
            </div>
          ) : (
            <div className="vault-grid-layout">
              {repoCards.map((card) => (
                <div 
                  key={card._id} 
                  className="quantum-tech-card"
                  onMouseMove={(e) => handleMouseMove(e, card._id)}
                  onMouseLeave={handleMouseLeave}
                >
                  {/* Dynamic Immersive Background Layer */}
                  <div className="card-sci-fi-bg" style={{ backgroundImage: `url(${card.bgImage})` }}></div>
                  <div className="cyber-overlay-shade"></div>
                  <div className="cyber-grid-overlay"></div>
                  
                  {/* Interactive Lighting Node Follower */}
                  <div className="cursor-flare-tracker"></div>

                  {/* Corner Tech Vectors Decorator */}
                  <div className="tech-corner bracket-tl"></div>
                  <div className="tech-corner bracket-br"></div>

                  <div className="card-telemetry">
                    <span className="lang-badge">
                      <span className="indicator-led"></span>
                      {card.language || 'Unknown'}
                    </span>
                    <span className="serial-id">// {card._id.substring(0, 8).toUpperCase()}</span>
                  </div>

                  <div className="card-main-identity">
                    <h3>{card.repoName}</h3>
                    <p className="repo-url-string">{card.repoUrl}</p>
                  </div>

                  <div className="card-interactive-action">
                    <a 
                      href={card.repoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="explore-trigger"
                    >
                      <span>See code</span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default Data;
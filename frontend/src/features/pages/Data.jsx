import React, { useEffect, useState, useRef } from 'react';
import Navbar2 from '../../components/Navbar2';
import useRepo from './hooks/userepo'; 
import { gsap } from 'gsap';
import '../../style/data.scss';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Perfected absolute slice action mapping
import { setpath } from '../pages/repo.slice.js'; 

const CYBER_CORES = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=600&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=600&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=600&auto=format&fit=crop"  
];

const Data = () => {
  // Destructuring handlegetcontent also to verify if metrics exist in active records database
  const { handlegetrepocard, handlegetcontent } = useRepo(); 
  const [repoCards, setRepoCards] = useState([]);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isChecking, setIsChecking] = useState(null); // Tracks layout click synchronization locks
  
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // FIX: Added Verification handshakes before allowing navigation pipelines
  const handleRoute = async (repourl, cardId) => {
    if (isChecking) return; // Prevention barrier for double-click requests
    
    setIsChecking(cardId); // Trigger dynamic card telemetry loading thread
    
    try {
      console.log(`📡 VERIFYING VAULT EXISTENCE FOR: ${repourl}`);
      const res = await handlegetcontent(repourl);
      
      // Strict Validation: Ensure data array structural elements actually exist
      if (res && res.contents && res.contents.length > 0) {
        // Double matching layer to verify content corresponds to currentpath targets
        const recordExists = res.contents.some(
          (item) => item.repoUrl?.trim().toLowerCase() === repourl.trim().toLowerCase()
        );

        if (recordExists) {
          console.log("🎯 Verification Successful. Dispatching route tokens...");
          dispatch(setpath(repourl)); 
          navigate('/contents'); 
          return;
        }
      }
      
      // Failsafe Layer: If record was not found or generation got corrupted
      console.warn("❌ CRITICAL: Architecture data missing. Redirecting to initialization dashboard.");
      alert("⚠️ This repository analysis hasn't been completed or generated yet. Redirecting to workspace hub...");
      navigate('/library'); // Dynamic fallback to engine center to recreate records
      
    } catch (err) {
      console.error("Pipeline failure checking registry index keys:", err);
    } finally {
      setIsChecking(null);
    }
  };

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await handlegetrepocard(); 
        if (res && res.repocard) {
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

  // GSAP Entrance Stagger Engine Blueprint
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

  // Dynamic Isometric 3D Hover Tilt Controller Matrix
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    
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
                  className={`quantum-tech-card ${isChecking === card._id ? 'card-loading-lock' : ''}`}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="card-sci-fi-bg" style={{ backgroundImage: `url(${card.bgImage})` }}></div>
                  <div className="cyber-overlay-shade"></div>
                  <div className="cyber-grid-overlay"></div>
                  
                  <div className="cursor-flare-tracker"></div>
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

                  {/* Bound Dynamic Content Shifting Handler with UI Loading feedback locks */}
                  <div 
                    className="card-interactive-action" 
                    onClick={() => handleRoute(card.repoUrl, card._id)}
                    style={{ cursor: isChecking ? 'not-allowed' : 'pointer' }}
                  >
                    <div className="explore-trigger">
                      {isChecking === card._id ? (
                        <>
                          <span className="cyber-mini-spin"></span>
                          <span>SYNCING REGISTRY...</span>
                        </>
                      ) : (
                        <>
                          <span>SEE CONTENTS</span>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                          </svg>
                        </>
                      )}
                    </div>
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
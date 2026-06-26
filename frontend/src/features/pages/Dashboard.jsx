import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import '../../style/dashboad.scss';
import Navbar2 from '../../components/Navbar2';
import useRepo from './hooks/userepo';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [url, setUrl] = useState('');
  const navigate = useNavigate();
  const panelRef = useRef(null);
  const scanTimelineRef = useRef(null); // Tracking GSAP timeline instance globally within render loop

  // Destructuring loading status from custom API hook
  const { handlecontent, loading: isLoading } = useRepo();

  // 1. Initial Page Load Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.premium-reveal', 
        { opacity: 0, y: 15, scale: 0.98 }, 
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out', stagger: 0.1 }
      );
      
      gsap.to('.ambient-glow-core', {
        opacity: 0.6,
        scale: 1.05,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    }, panelRef);

    return () => ctx.revert();
  }, []);

  // 2. Dynamic Laser Scanning Watcher 
  // FIXED: GSAP timeline trigger block optimized for raw loop performance
  useEffect(() => {
    if (isLoading) {
      console.log("⚡ ENGAGING LASER SCANNER: AI processing has initiated.");
      
      // Target clean setup for scanning beam container
      gsap.set('.laser-scan-line', { opacity: 1, left: '-10%' });
      
      scanTimelineRef.current = gsap.timeline({ repeat: -1 });
      scanTimelineRef.current.to('.laser-scan-line', { 
        left: '110%', 
        duration: 1.8, // Slightly extended for beautiful techno-feel
        ease: 'power2.inOut' 
      });
    } else {
      console.log("🛑 DISENGAGING LASER SCANNER");
      if (scanTimelineRef.current) {
        scanTimelineRef.current.kill();
        scanTimelineRef.current = null;
      }
      // Instantly fade out line if loading drops
      gsap.to('.laser-scan-line', { opacity: 0, duration: 0.3 });
    }

    return () => {
      if (scanTimelineRef.current) scanTimelineRef.current.kill();
    };
  }, [isLoading]);

  // 3. Form Submission Handling
  // FIXED: Strictly enforced async pipeline blocking to prevent pre-mature routing
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Safety Guard Lock: Block actions if url is empty or system is already executing
    if (!url.trim() || isLoading) return;

    try {
      console.log("🚀 Initializing Handshake Protocol for link:", url);
      
      // 1. Await completely for the backend to finish data collection & AI model processing
      const res = await handlecontent(url);
      
      // 2. STRICT VALIDATION CHECK: Navigate only if response exists and is successful
      if (res) {
        console.log("✅ Analysis complete! Routing to history ledger...");
        // Redirect directly to your data vault lists page
        navigate('/data'); 
      } else {
        console.warn("⚠️ Backend responded but token parsing failed.");
      }
    } catch (error) {
      console.error("❌ Thread execution halted during repository scan:", error);
    }
  };

  return (
    <div className="premium-panel-container" ref={panelRef}>
      <Navbar2 />
      
      {/* Layered Cyber Ambient Glows */}
      <div className="ambient-glow-core glow-p"></div>
      <div className="ambient-glow-core glow-b"></div>

      <div className="modern-glass-card premium-reveal">
        <div className="card-grid-lines"></div>

        {/* System Telemetry Header */}
        <div className="panel-header-status premium-reveal">
          <div className="engine-tag">
            <span className={`dot ${isLoading ? 'scanning-pulse' : ''}`}></span>
            <p>{isLoading ? "ANALYZING CORE DATA VECTORS" : "REPOLENS CORE ENGINE v2"}</p>
          </div>
          <div className="security-tag">{isLoading ? "COMPILING SYSTEM" : "AES-256 SECURE"}</div>
        </div>

        {/* Description Headings */}
        <div className="panel-text-block premium-reveal">
          <h1>Analyze Repository <span>Architecture</span></h1>
          <p>Drop your repository or vault URL below to instantly execute security sweeps, interview generation, and modular structure tracking.</p>
        </div>

        {/* Input Wrapper Field */}
        <form className="saas-vector-form premium-reveal" onSubmit={handleSubmit}>
          <div className={`input-field-wrapper ${isLoading ? 'is-loading-active' : ''}`}>
            
            {/* The Animated Laser Beam Line Container */}
            <div className="laser-scan-line" style={{ opacity: isLoading ? 1 : 0 }} />
            
            <div className="input-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </div>

            <input 
              type="url" 
              placeholder={isLoading ? "ENGAGING PROTOCOLS // SCANNING DATA STREAMS..." : "Paste your target repository URL here..."} 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isLoading}
              required
            />

            <button type="submit" className={`neon-submit-trigger ${isLoading ? 'disabled-glow' : ''}`} disabled={isLoading}>
              {isLoading ? (
                <div className="loading-dots">
                  <span></span><span></span><span></span>
                </div>
              ) : (
                <>
                  <span>Analyze</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Real-time Status Micro Metrics */}
        <div className="panel-footer-metrics premium-reveal">
          <span className="token">STATUS: {isLoading ? "COMPILING INDEX METRICS..." : "READY TO STREAM"}</span>
          <span className="token">JWT AUTH LINK ACTIVE</span>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
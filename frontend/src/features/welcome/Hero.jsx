import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import '../../style/hero.scss';
import Navbar from '../../components/Navbar';

const Hero = () => {
  const heroRef = useRef(null);
  const navRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const ctaRef = useRef(null);
  const footerRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline();

      gsap.to(heroRef.current, { opacity: 1, duration: 0.1 });

      // Perfect cinematic top-down sequential reveal
      tl.fromTo(navRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
      )
      .fromTo(titleRef.current, 
        { y: 40, opacity: 0, scale: 0.99 },
        { y: 0, opacity: 1, scale: 1, duration: 0.9, ease: 'power3.out' },
        '-=0.4'
      )
      .fromTo(descRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
        '-=0.6'
      )
      .fromTo(ctaRef.current,
        { scale: 0.95, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.2)' },
        '-=0.4'
      )
      .fromTo(footerRef.current.querySelectorAll('.hero__meta-item'),
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.5, ease: 'power2.out' },
        '-=0.3'
      );

    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="hero">
      <div className="hero__glow-system">
        <div className="hero__glow hero__glow--purple"></div>
        <div className="hero__glow hero__glow--blue"></div>
      </div>

      <div className="hero__container">
        
   

        {/* --- Main Content --- */}
        <div className="hero__main">
          <h1 ref={titleRef} className="hero__title">
            UNDERSTAND ANY REPO WITH <span className="hero__highlight">AI LENS</span>
          </h1>

          <p ref={descRef} className="hero__description">
          Analyze. Improve. Showcase.
Transform any GitHub repository into a professional AI-powered report with recruiter insights, technical reviews, and career-ready feedback.
          </p>

          <div ref={ctaRef} className="hero__action-zone">
            <button className="hero__cta">
              <span className="hero__cta-text">Explore Workspace</span>
              <span className="hero__cta-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </span>
            </button>
          </div>
        </div>

        {/* --- Footer Status Row --- */}
        <div ref={footerRef} className="hero__footer">
          <div className="hero__meta-item">
            <span className="hero__meta-dot"></span>
            <span className="hero__meta-label">SYSTEM MATRIX:</span>
            <span className="hero__meta-val hero__meta-val--active">ONLINE</span>
          </div>
          <div className="hero__meta-item">
            <span className="hero__meta-label">ANALYZED COMPILATIONS:</span>
            <span className="hero__meta-val">982,410+ REPOS</span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
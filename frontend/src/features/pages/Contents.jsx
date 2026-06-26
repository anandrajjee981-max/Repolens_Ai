import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import { Copy, Check, Flame, Terminal, FileText, HelpCircle, AlertTriangle, CheckCircle, ShieldAlert, Cpu } from 'lucide-react';
import { gsap } from 'gsap';
import useRepo from './hooks/userepo';
import Navbar2 from '../../components/Navbar2';
import '../../style/contents.scss';

const Contents = () => {
  const { handlegetcontent } = useRepo();
  const currentpath = useSelector((state) => state.repo.currentpath);
  
  // States are initialized to null dynamically to prevent cross-contamination
  const [analysisData, setAnalysisData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedSection, setCopiedSection] = useState(null);
  const [activeTab, setActiveTab] = useState('readme');

  const containerRef = useRef(null);
  const scoreRef = useRef(null);

  const cleanAndParseJSON = (rawString) => {
    if (!rawString) return null;
    if (typeof rawString === 'object') return rawString;
    try {
      const target = rawString.replace(/```json/gi, '').replace(/```/g, '').trim();
      return JSON.parse(target);
    } catch (e) {
      return null;
    }
  };

  const sanitizeReadme = (text) => {
    if (!text) return '';
    return text
      .replace(/!\[.*?\]\(.*?\)/g, '') 
      .replace(/\[!\[.*?\]\(.*?\)]\(.*?\)/g, '')
      .replace(/\|[\s\S]*?\|[\s\S]*?\|/g, '')
      .replace(/\|.*?\|/g, '')
      .replace(/##\s+License[\s\S]*/gi, '')
      .replace(/###\s+License[\s\S]*/gi, '')
      .replace(/MIT License/gi, '')
      .replace(/This project is d.*/gi, '')
      .trim();
  };

  // Critical Patch: Added cleanup flag & array matching logic to drop stale memory instantly
  useEffect(() => {
    let isCurrentRouteActive = true;

    const fetchContentData = async () => {
      if (!currentpath) return;
      
      // Forces layout state drop before dynamic asset re-fetch
      setIsLoading(true);
      setAnalysisData(null); 
      setActiveTab('readme'); 

      try {
        console.log("🔗 Fetching architecture metrics for target:", currentpath);
        const res = await handlegetcontent(currentpath);
        
        // If user changed the tab or navigated back rapidly, abort writing data
        if (!isCurrentRouteActive) return;

        if (res && res.contents && res.contents.length > 0) {
          
          // CRITICAL ARRAY FILTER: Direct search pattern inside database collection
          // filter matching record by repoUrl to prevent showing the first entry (Affectra) everywhere
          const matchedDbRecord = res.contents.find(
            (item) => item.repoUrl?.trim().toLowerCase() === currentpath.trim().toLowerCase()
          ) || res.contents[0]; // Strict fallback alignment

          console.log("🎯 Current Sync Matched DB Record:", matchedDbRecord.repoUrl);

          const parsedReview = cleanAndParseJSON(matchedDbRecord.review);
          const parsedRoast = cleanAndParseJSON(matchedDbRecord.roast);
          
          let extractedQuestions = [];
          if (matchedDbRecord.questions && matchedDbRecord.questions.length > 0) {
            const cleanQuestionsObj = cleanAndParseJSON(matchedDbRecord.questions[0]);
            if (cleanQuestionsObj) {
              if (cleanQuestionsObj.beginner) extractedQuestions.push(...cleanQuestionsObj.beginner);
              if (cleanQuestionsObj.intermediate) extractedQuestions.push(...cleanQuestionsObj.intermediate);
              if (cleanQuestionsObj.advanced) extractedQuestions.push(...cleanQuestionsObj.advanced);
            }
          }

          setAnalysisData({
            repoUrl: matchedDbRecord.repoUrl,
            readme: sanitizeReadme(matchedDbRecord.readme),
            review: parsedReview,
            roast: parsedRoast,
            questions: extractedQuestions.length > 0 ? extractedQuestions : null
          });
        } else {
          setAnalysisData(null);
        }
      } catch (err) {
        console.error("Backend content processing failed:", err);
        if (isCurrentRouteActive) setAnalysisData(null);
      } finally {
        if (isCurrentRouteActive) setIsLoading(false);
      }
    };

    fetchContentData();

    // Garbage collector layer to purge cache streams on component route unmount
    return () => {
      isCurrentRouteActive = false;
    };
  }, [currentpath]); // Tracking dynamic redux state shifts

  useEffect(() => {
    if (!isLoading && analysisData) {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline();
        tl.fromTo('.content-telemetry-header', 
          { opacity: 0, y: -20 }, 
          { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
        )
        .fromTo('.tab-trigger', 
          { opacity: 0, y: 10 }, 
          { opacity: 1, y: 0, stagger: 0.05, duration: 0.3, ease: 'power2.out' },
          '-=0.2'
        )
        .fromTo('.dashboard-terminal-screen', 
          { opacity: 0, y: 20 }, 
          { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
          '-=0.1'
        );
      }, containerRef);
      return () => ctx.revert();
    }
  }, [isLoading, analysisData]);

  const copyToClipboard = (text, sectionId) => {
    const outStr = typeof text === 'object' ? JSON.stringify(text, null, 2) : text;
    navigator.clipboard.writeText(outStr);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="contents-loading-screen">
        <div className="cyber-spinner"></div>
        <p className="cyber-glitch-text">FETCHING_COMPILER_METRICS...</p>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div className="contents-error-screen">
        <ShieldAlert size={24} />
        <p>// NO_ACTIVE_DATA_STREAM_FOUND_FOR_TARGET</p>
      </div>
    );
  }

  return (
    <div className="content-dashboard-root" ref={containerRef}>
      <Navbar2 />
      <div className="dashboard-lens-glow"></div>
      <div className="ambient-grid-lines"></div>

      <div className="content-container-wrapper">
        
        {/* Telemetry Header */}
        <header className="content-telemetry-header">
          <div className="left-meta">
            <span className="live-pill"><span className="pulse-dot"></span> SYSTEM_LIVE</span>
            <h1 className="cyber-glitch-title">{analysisData.repoUrl?.split('/').pop() || "REPOSITORY TARGET"}</h1>
            <p className="repo-hash-link">{analysisData.repoUrl}</p>
          </div>
          
          {analysisData.review?.overallScore && (
            <div className="score-badge-matrix" ref={scoreRef}>
              <Cpu size={18} className="award-ico" />
              <div className="score-data">
                <span className="score-num">{analysisData.review.overallScore}</span>
                <span className="score-max">HEALTH INDEX</span>
              </div>
            </div>
          )}
        </header>

        {/* Tab switcher */}
        <nav className="dashboard-tab-bar">
          <button className={`tab-trigger ${activeTab === 'readme' ? 'active' : ''}`} onClick={() => setActiveTab('readme')}>
            <FileText size={14} /> <span>DOCUMENTATION</span>
          </button>
          <button className={`tab-trigger ${activeTab === 'review' ? 'active' : ''}`} onClick={() => setActiveTab('review')}>
            <Terminal size={14} /> <span>CORE ANALYSIS</span>
          </button>
          <button className={`tab-trigger ${activeTab === 'roast' ? 'active' : ''}`} onClick={() => setActiveTab('roast')}>
            <Flame size={14} /> <span>CRITICAL ROAST</span>
          </button>
          {analysisData.questions && (
            <button className={`tab-trigger ${activeTab === 'questions' ? 'active' : ''}`} onClick={() => setActiveTab('questions')}>
              <HelpCircle size={14} /> <span>INTERVIEW PATHWAY</span>
            </button>
          )}
        </nav>

        {/* Main Console Grid Terminal */}
        <main className="dashboard-terminal-screen">
          <div className="panel-animated-content">
            
            {/* DOCUMENTATION PANEL */}
            {activeTab === 'readme' && (
              <div className="terminal-panel">
                <div className="panel-action-bar">
                  <span>LOG // SANITIZED_SOURCE_DOCUMENTATION</span>
                  <button className="copy-action-btn" onClick={() => copyToClipboard(analysisData.readme, 'readme')}>
                    {copiedSection === 'readme' ? <Check size={12} color="#a855f7" /> : <Copy size={12} />}
                    <span>{copiedSection === 'readme' ? 'COPIED' : 'COPY BUFFER'}</span>
                  </button>
                </div>
                <article className="markdown-body-content">
                  {analysisData.readme ? (
                    <ReactMarkdown>{analysisData.readme}</ReactMarkdown>
                  ) : (
                    <p className="no-data-notice">// STACK_EMPTY_OR_UNREADABLE</p>
                  )}
                </article>
              </div>
            )}

            {/* CORE REVIEWS MAP */}
            {activeTab === 'review' && (
              <div className="terminal-panel architecture-review-panel">
                <div className="panel-action-bar">
                  <span>METRICS // METRIC_SYSTEM_EVALUATION</span>
                </div>
                <div className="review-card-layout">
                  {analysisData.review?.hiringRecommendation && (
                    <div className="recommendation-strip">
                      <div className="strip-neon-indicator"></div>
                      <h3>EVALUATED ASSESSMENT TRACK</h3>
                      <p className="recommendation-value">{analysisData.review.hiringRecommendation}</p>
                    </div>
                  )}
                  
                  <div className="review-split-grid">
                    {analysisData.review?.strengths && (
                      <div className="review-split-box strength-card">
                        <div className="box-header green-neon">
                          <CheckCircle size={14} /> <span>SYSTEM STRENGTHS</span>
                        </div>
                        <ul className="bullet-insights">
                          {analysisData.review.strengths.map((str, idx) => (
                            <li key={idx}>{str}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {analysisData.review?.weaknesses && (
                      <div className="review-split-box weakness-card">
                        <div className="box-header red-neon">
                          <AlertTriangle size={14} /> <span>CRITICAL DEPRECIATIONS</span>
                        </div>
                        <ul className="bullet-insights">
                          {analysisData.review.weaknesses.map((wk, idx) => (
                            <li key={idx}>{wk}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* SYNTAX HIGHLIGHT INLINE ROAST TERMINAL */}
            {activeTab === 'roast' && (
              <div className="terminal-panel roast-matrix-panel">
                <div className="panel-action-bar status-alert-roast">
                  <span>DANGER // RAW_COMPILER_CRITICAL_ROASTS</span>
                </div>
                <div className="roast-standard-stream">
                  {analysisData.roast?.roasts ? (
                    analysisData.roast.roasts.map((line, idx) => (
                      <div key={idx} className="roast-terminal-row">
                        <div className="line-counter">{(idx + 1).toString().padStart(2, '0')}</div>
                        <span className="error-syntax-flag">[CRIT_BUG]</span>
                        <p className="roast-pure-text">{line}</p>
                      </div>
                    ))
                  ) : (
                    <div className="roast-terminal-row">
                      <div className="line-counter">01</div>
                      <span className="error-syntax-flag">[CORE_DUMP]</span>
                      <p className="roast-pure-text">
                        {typeof analysisData.roast === 'object' ? JSON.stringify(analysisData.roast) : String(analysisData.roast)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* FIXED STANDARD Q&A */}
            {activeTab === 'questions' && (
              <div className="terminal-panel questions-panel">
                <div className="panel-action-bar">
                  <span>SYSTEM_STACK // STANDARD_INTERVIEW_FLOW</span>
                </div>
                <div className="qa-explicit-vertical-stack">
                  {analysisData.questions.map((q, idx) => (
                    <div key={idx} className="qa-explicit-block">
                      
                      <div className="question-row-node">
                        <div className="text-cluster">
                          <span className="prefix-index">Q{idx + 1}.</span>
                          <h3 className="explicit-question-string">{q.question}</h3>
                        </div>
                        {q.difficulty && (
                          <span className={`difficulty-flag ${q.difficulty.toLowerCase()}`}>
                            {q.difficulty.toUpperCase()}
                          </span>
                        )}
                      </div>

                      {q.answerTopics && q.answerTopics.length > 0 && (
                        <div className="answer-row-node">
                          <div className="answer-indicator-label">EXPECTED CRITERIA ANSWER:</div>
                          <div className="topics-inline-wrapper">
                            {q.answerTopics.map((topic, tIdx) => (
                              <span key={tIdx} className="explicit-topic-badge">{topic}</span>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
};

export default Contents;
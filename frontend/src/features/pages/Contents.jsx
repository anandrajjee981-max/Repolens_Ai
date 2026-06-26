import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import { Copy, Check, Flame, Terminal, FileText, HelpCircle, AlertTriangle, CheckCircle, ShieldAlert, Cpu, Download } from 'lucide-react';
import { gsap } from 'gsap';
import useRepo from './hooks/userepo';
import Navbar2 from '../../components/Navbar2';
import '../../style/contents.scss';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Contents = () => {
  const { handlegetcontent } = useRepo();
  const currentpath = useSelector((state) => state.repo.currentpath);
  
  const [analysisData, setAnalysisData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [copiedSection, setCopiedSection] = useState(null);
  const [activeTab, setActiveTab] = useState('readme');

  const containerRef = useRef(null);
  const scoreRef = useRef(null);
  const printTemplateRef = useRef(null);

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

  const exportPremiumPDF = async () => {
    const element = printTemplateRef.current;
    if (!element) return;

    try {
      setIsPdfGenerating(true);
      element.style.display = 'block';

      const canvas = await html2canvas(element, {
        scale: 2, 
        useCORS: true,
        backgroundColor: '#ffffff', 
        logging: false,
        windowWidth: 850, 
      });

      element.style.display = 'none';

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210; 
      const pageHeight = 297; 
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pageHeight;
      }

      const targetName = analysisData.repoUrl?.split('/').pop() || "repository";
      pdf.save(`RepoLens-${targetName}-Report.pdf`);

    } catch (error) {
      console.error("PDF generation layout failure:", error);
    } finally {
      setIsPdfGenerating(false);
    }
  };

  useEffect(() => {
    let isCurrentRouteActive = true;

    const fetchContentData = async () => {
      if (!currentpath) return;
      
      setIsLoading(true);
      setAnalysisData(null); 

      try {
        const res = await handlegetcontent(currentpath);
        if (!isCurrentRouteActive) return;

        if (res && res.contents && res.contents.length > 0) {
          const matchedDbRecord = res.contents.find(
            (item) => item.repoUrl?.trim().toLowerCase() === currentpath.trim().toLowerCase()
          ) || res.contents[0];

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
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isCurrentRouteActive) setIsLoading(false);
      }
    };

    fetchContentData();
    return () => { isCurrentRouteActive = false; };
  }, [currentpath]);

  useEffect(() => {
    if (!isLoading && analysisData) {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline();
        tl.fromTo('.content-telemetry-header', { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' })
          .fromTo('.tab-trigger', { opacity: 0, y: 10 }, { opacity: 1, y: 0, stagger: 0.05, duration: 0.3, ease: 'power2.out' }, '-=0.2')
          .fromTo('.dashboard-terminal-screen', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, '-=0.1');
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
        
        <header className="content-telemetry-header">
          <div className="left-meta">
            <span className="live-pill"><span className="pulse-dot"></span> SYSTEM_LIVE</span>
            <h1 className="cyber-glitch-title">{analysisData.repoUrl?.split('/').pop() || "REPOSITORY TARGET"}</h1>
            <p className="repo-hash-link">{analysisData.repoUrl}</p>
          </div>
          
          <div className="header-action-matrix">
            <button 
              className={`export-pdf-btn ${isPdfGenerating ? 'compiling' : ''}`} 
              onClick={exportPremiumPDF}
              disabled={isPdfGenerating}
            >
              {isPdfGenerating ? (
                <>
                  <div className="pdf-mini-spinner"></div>
                  <span>GENERATING_PDF...</span>
                </>
              ) : (
                <>
                  <Download size={14} />
                  <span>EXPORT REPORT</span>
                </>
              )}
            </button>

            {analysisData.review?.overallScore && (
              <div className="score-badge-matrix" ref={scoreRef}>
                <Cpu size={18} className="award-ico" />
                <div className="score-data">
                  <span className="score-num">{analysisData.review.overallScore}</span>
                  <span className="score-max">HEALTH INDEX</span>
                </div>
              </div>
            )}
          </div>
        </header>

        <nav className="dashboard-tab-bar">
          <button className={`tab-trigger ${activeTab === 'review' ? 'active' : ''}`} onClick={() => setActiveTab('review')}>
            <Terminal size={14} /> <span>CORE ANALYSIS</span>
          </button>
          <button className={`tab-trigger ${activeTab === 'readme' ? 'active' : ''}`} onClick={() => setActiveTab('readme')}>
            <FileText size={14} /> <span>DOCUMENTATION</span>
          </button>
          <button className={`tab-trigger ${activeTab === 'questions' ? 'active' : ''}`} onClick={() => setActiveTab('questions')}>
            <HelpCircle size={14} /> <span>INTERVIEW PATHWAY</span>
          </button>
          <button className={`tab-trigger ${activeTab === 'roast' ? 'active' : ''}`} onClick={() => setActiveTab('roast')}>
            <Flame size={14} /> <span>CRITICAL ROAST</span>
          </button>
        </nav>

        <main className="dashboard-terminal-screen">
          <div className="panel-animated-content">
            
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
                        <div className="box-header green-neon"><CheckCircle size={14} /> <span>SYSTEM STRENGTHS</span></div>
                        <ul className="bullet-insights">
                          {analysisData.review.strengths.map((str, idx) => <li key={idx}>{str}</li>)}
                        </ul>
                      </div>
                    )}
                    {analysisData.review?.weaknesses && (
                      <div className="review-split-box weakness-card">
                        <div className="box-header red-neon"><AlertTriangle size={14} /> <span>CRITICAL DEPRECIATIONS</span></div>
                        <ul className="bullet-insights">
                          {analysisData.review.weaknesses.map((wk, idx) => <li key={idx}>{wk}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

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
                  {analysisData.readme ? <ReactMarkdown>{analysisData.readme}</ReactMarkdown> : <p className="no-data-notice">// STACK_EMPTY_OR_UNREADABLE</p>}
                </article>
              </div>
            )}

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
                        {q.difficulty && <span className={`difficulty-flag ${q.difficulty.toLowerCase()}`}>{q.difficulty.toUpperCase()}</span>}
                      </div>
                      {q.answerTopics && q.answerTopics.length > 0 && (
                        <div className="answer-row-node">
                          <div className="answer-indicator-label">EXPECTED CRITERIA ANSWER:</div>
                          <div className="topics-inline-wrapper">
                            {q.answerTopics.map((topic, tIdx) => <span key={tIdx} className="explicit-topic-badge">{topic}</span>)}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'roast' && (
              <div className="terminal-panel roast-matrix-panel">
                <div className="panel-action-bar status-alert-roast">
                  <span>DANGER // RAW_COMPILER_CRITICAL_ROASTS</span>
                </div>
                <div className="roast-standard-stream">
                  {analysisData.roast?.roasts ? (
                    analysisData.roast.roasts.map((line, idx) => (
                      <div key={idx} className="roast-terminal-row">
                        <div className="line-counter">{idx + 1}</div>
                        <span className="error-syntax-flag">[CRIT_BUG]</span>
                        <p className="roast-pure-text">{line}</p>
                      </div>
                    ))
                  ) : (
                    <div className="roast-terminal-row">
                      <div className="line-counter">01</div>
                      <span className="error-syntax-flag">[CORE_DUMP]</span>
                      <p className="roast-pure-text">{String(analysisData.roast)}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* REPOLENS HIGH-FIDELITY PRINT RENDERING SYSTEM */}
      <div 
        className="pdf-master-compilation-template" 
        ref={printTemplateRef} 
        style={{ display: 'none', position: 'absolute', left: '-9999px', width: '800px' }}
      >
        <div className="pdf-watermark-overlay"></div>
        <div className="pdf-internal-content-wrapper">
          
          <div className="pdf-compiled-header">
            <div className="pdf-header-main">
              <h2>REPOLENS AI ASSESSMENT </h2>
              {analysisData.review?.overallScore && (
                <div className="pdf-score-box">
                  <span className="label">AI SCORE:</span>
                  <span className="val">{analysisData.review.overallScore}/100</span>
                </div>
              )}
            </div>
            <p className="pdf-target-url">TARGET STREAM: {analysisData.repoUrl}</p>
          </div>

          <div className="pdf-section-container printable-node-block">
            <h3 className="pdf-section-title">01 / CORE ARCHITECTURAL EVALUATION</h3>
            {analysisData.review?.hiringRecommendation && (
              <div className="pdf-meta-strip">
                <strong>ASSESSMENT TRACK:</strong> {analysisData.review.hiringRecommendation}
              </div>
            )}
            <div className="pdf-split-row">
              {analysisData.review?.strengths && (
                <div className="pdf-split-col">
                  <h4>[+] DETECTED STRENGTHS</h4>
                  <ul>
                    {analysisData.review.strengths.map((str, i) => <li key={i}>{str}</li>)}
                  </ul>
                </div>
              )}
              {analysisData.review?.weaknesses && (
                <div className="pdf-split-col">
                  <h4>[-] SYSTEM DEPRECIATIONS</h4>
                  <ul>
                    {analysisData.review.weaknesses.map((wk, i) => <li key={i}>{wk}</li>)}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="pdf-section-container printable-node-block">
            <h3 className="pdf-section-title">02 / REPOSITORY DOCUMENTATION MAPPING</h3>
            <div className="pdf-markdown-render">
              {analysisData.readme ? (
                <ReactMarkdown>{analysisData.readme}</ReactMarkdown>
              ) : (
                <p className="pdf-fallback-text">No documentation dataset mapped inside target.</p>
              )}
            </div>
          </div>

          {analysisData.questions && (
            <div className="pdf-section-container printable-node-block">
              <h3 className="pdf-section-title">03 / TECHNICAL INTERVIEW VALIDATION FLOW</h3>
              <div className="pdf-qa-stack">
                {analysisData.questions.map((q, i) => (
                  <div key={i} className="pdf-qa-row-item dynamic-page-avoid">
                    <p className="pdf-question-txt">
                      <strong>Q{i+1}. {q.question}</strong> 
                      {q.difficulty && <span className="pdf-diff-tag">{q.difficulty.toUpperCase()}</span>}
                    </p>
                    {q.answerTopics && q.answerTopics.length > 0 && (
                      <p className="pdf-topics-txt">Evaluation Nodes: {q.answerTopics.join(', ')}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {analysisData.roast && (
            <div className="pdf-section-container printable-node-block">
              <h3 className="pdf-section-title">04 / CORE COMPILER DEVIATION LOGS (ROAST)</h3>
              <div className="pdf-roast-log-block">
                {analysisData.roast.roasts ? (
                  analysisData.roast.roasts.map((line, i) => (
                    <div key={i} className="pdf-roast-line dynamic-page-avoid">
                      <code>[FLAG_{i+1}]</code> <span>{line}</span>
                    </div>
                  ))
                ) : (
                  <p className="pdf-roast-line"><code>[CORE_DUMP]</code> {String(analysisData.roast)}</p>
                )}
              </div>
            </div>
          )}

          <div className="pdf-compiled-footer">
            <p>CONFIDENTIAL ARCHITECT DOSSIER // GENERATED VIA REPOLENS FRAMEWORK MATRIX 2026</p>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Contents;
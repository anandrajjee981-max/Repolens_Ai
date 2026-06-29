import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import {
  Copy, Check, Flame, Terminal, FileText, HelpCircle,
  AlertTriangle, CheckCircle, ShieldAlert, Download,
} from 'lucide-react';
import { gsap } from 'gsap';
import useRepo from './hooks/userepo';
import Navbar2 from '../../components/Navbar2';
import '../../style/contents.scss';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const TABS = [
  { id: 'review', label: 'CORE ANALYSIS', icon: Terminal },
  { id: 'readme', label: 'DOCUMENTATION', icon: FileText },
  { id: 'questions', label: 'INTERVIEW PATHWAY', icon: HelpCircle },
  { id: 'roast', label: 'CRITICAL ROAST', icon: Flame },
];

/**
 * AI/recruiter output arrives as JSON strings (strengths, roast lines, question
 * text, etc). Those strings can legally contain markdown (**bold**, `code`,
 * links) — InlineMarkdown renders that formatting without injecting block
 * elements, so it's safe to drop inside <li>, <p>, <h3> or a topic badge.
 */
const InlineMarkdown = ({ children }) => {
  if (!children) return null;
  return (
    <ReactMarkdown
      components={{
        p: ({ children }) => <span className="md-inline-block">{children}</span>,
        strong: ({ children }) => <strong className="md-em-strong">{children}</strong>,
        em: ({ children }) => <em className="md-em-italic">{children}</em>,
        code: ({ children }) => <code className="md-em-code">{children}</code>,
        a: ({ href, children }) => (
          <a href={href} target="_blank" rel="noopener noreferrer" className="md-em-link">{children}</a>
        ),
        ul: ({ children }) => <>{children}</>,
        ol: ({ children }) => <>{children}</>,
        li: ({ children }) => <>{children} </>,
      }}
    >
      {String(children)}
    </ReactMarkdown>
  );
};

// Signature element — radial AI confidence gauge that fills in once the data lands
const ScoreRing = ({ score = 0, size = 56 }) => {
  const ringRef = useRef(null);
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(Math.max(Number(score) || 0, 0), 100);
  const offset = circumference - (clamped / 100) * circumference;

  useEffect(() => {
    if (ringRef.current) {
      gsap.fromTo(
        ringRef.current,
        { strokeDashoffset: circumference },
        { strokeDashoffset: offset, duration: 1.1, ease: 'power3.out', delay: 0.4 }
      );
    }
  }, [offset, circumference]);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="score-ring-svg">
      <defs>
        <linearGradient id="scoreRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
      <circle
        ref={ringRef}
        cx={size / 2} cy={size / 2} r={radius} fill="none"
        stroke="url(#scoreRingGradient)" strokeWidth="4" strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
};

const Contents = () => {
  const { handlegetcontent } = useRepo();
  const currentpath = useSelector((state) => state.repo.currentpath);

  const [analysisData, setAnalysisData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [copiedSection, setCopiedSection] = useState(null);
  const [activeTab, setActiveTab] = useState('readme');

  const containerRef = useRef(null);
  const printTemplateRef = useRef(null);
  const tabRefs = useRef({});
  const sliderRef = useRef(null);
  const isFirstTabRender = useRef(true);

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

  // FIXED: line-by-line table stripping instead of a cross-newline regex
  // that was eating arbitrary chunks of the README (including heading lines),
  // which is why "##" was showing up as literal text in the rendered output.
  const sanitizeReadme = (text) => {
    if (!text) return '';

    const cleanedLines = text.split('\n').filter((line) => {
      const trimmed = line.trim();
      // a real markdown table row: "| col | col |"
      if (/^\|.*\|$/.test(trimmed)) return false;
      // a table separator row: "|---|:--:|"
      if (/^[|:\-\s]+$/.test(trimmed) && trimmed.includes('-') && trimmed.includes('|')) return false;
      return true;
    });

    return cleanedLines
      .join('\n')
      .replace(/!\[.*?\]\(.*?\)/g, '')
      .replace(/\[!\[.*?\]\(.*?\)\]\(.*?\)/g, '')
      .replace(/##\s+License[\s\S]*/gi, '')
      .replace(/###\s+License[\s\S]*/gi, '')
      .replace(/MIT License/gi, '')
      .replace(/This project is d.*/gi, '')
      .trim();
  };

  // Advanced PDF compilation engine with multi-page absolute canvas safety mapping
  const exportPremiumPDF = async () => {
    const element = printTemplateRef.current;
    if (!element) return;

    try {
      setIsPdfGenerating(true);

      element.style.display = 'block';
      element.style.position = 'relative';
      element.style.left = '0';
      element.style.width = '780px';

      // FIXED: give the browser a couple of frames to fully commit layout
      // (fonts, computed styles, table-stripped README reflow) before the
      // canvas snapshot is taken — avoids half-painted/garbled captures.
      await new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve))
      );

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#0b0b12',
        logging: false,
        allowTaint: true,
        windowWidth: 780,
      });

      element.style.display = 'none';
      element.style.position = 'absolute';
      element.style.left = '-9999px';

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

      const targetName = analysisData.repoUrl?.split('/').pop() || 'repository';
      pdf.save(`RepoLens-${targetName}-MatrixReport.pdf`);
    } catch (error) {
      console.error('PDF engine structural failure:', error);
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
            questions: extractedQuestions.length > 0 ? extractedQuestions : null,
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

  // Master GSAP Micro-Interaction Orchestration — one orchestrated boot sequence, not scattered effects
  useEffect(() => {
    if (!isLoading && analysisData) {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline();

        tl.fromTo('.content-telemetry-header',
          { opacity: 0, y: -30, filter: 'blur(10px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, ease: 'expo.out' }
        )
          .fromTo('.signature-score-ring',
            { scale: 0.85, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' },
            '-=0.4'
          )
          .fromTo('.tab-trigger',
            { opacity: 0, x: -15 },
            { opacity: 1, x: 0, stagger: 0.06, duration: 0.4, ease: 'power2.out' },
            '-=0.3'
          )
          .fromTo('.dashboard-terminal-screen',
            { opacity: 0, y: 40, scale: 0.98, transformOrigin: 'bottom center' },
            { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power4.out' },
            '-=0.2'
          );
      }, containerRef);
      return () => ctx.revert();
    }
  }, [isLoading, analysisData]);

  // Tab switching contextual trigger morph animation system
  useEffect(() => {
    if (!isLoading && analysisData) {
      gsap.fromTo('.panel-animated-content',
        { opacity: 0, y: 15, filter: 'blur(4px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.4, ease: 'power3.out' }
      );

      gsap.fromTo('.review-split-box, .qa-explicit-block, .roast-terminal-row',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.04, duration: 0.4, ease: 'power2.out' }
      );
    }
  }, [activeTab, isLoading]);

  // Sliding pill indicator follows the active tab — single deliberate motion
  useEffect(() => {
    const activeEl = tabRefs.current[activeTab];
    if (!activeEl || !sliderRef.current) return;

    if (isFirstTabRender.current) {
      gsap.set(sliderRef.current, { x: activeEl.offsetLeft, width: activeEl.offsetWidth });
      isFirstTabRender.current = false;
    } else {
      gsap.to(sliderRef.current, {
        x: activeEl.offsetLeft,
        width: activeEl.offsetWidth,
        duration: 0.45,
        ease: 'power3.out',
      });
    }
  }, [activeTab, isLoading, analysisData]);

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

  const repoName = analysisData.repoUrl?.split('/').pop() || 'REPOSITORY TARGET';
  const repoInitial = repoName.charAt(0).toUpperCase() || 'R';
  const overallScore = analysisData.review?.overallScore;

  return (
    <div className="content-dashboard-root" ref={containerRef}>
      <Navbar2 />
      <div className="dashboard-lens-glow"></div>
      <div className="dashboard-lens-glow-secondary"></div>
      <div className="ambient-grid-lines"></div>

      <div className="content-container-wrapper">

        <header className="content-telemetry-header">
          <div className="left-meta">
            <div className="repo-avatar-badge">{repoInitial}</div>
            <div className="title-stack">
              <span className="live-pill"><span className="pulse-dot"></span> SYSTEM_LIVE</span>
              <h1 className="cyber-glitch-title">{repoName}</h1>
              <p className="repo-hash-link">{analysisData.repoUrl}</p>
            </div>
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

            {overallScore != null && (
              <div className="signature-score-ring">
                <div className="ring-glow-halo"></div>
                <div style={{ position: 'relative', width: 56, height: 56 }}>
                  <ScoreRing score={overallScore} size={56} />
                  <div className="score-ring-center">{overallScore}</div>
                </div>
                <div className="score-data">
                  <span className="score-num-label">HEALTH INDEX</span>
                  <span className="score-rec">
                    {analysisData.review?.hiringRecommendation
                      ? <InlineMarkdown>{analysisData.review.hiringRecommendation}</InlineMarkdown>
                      : 'AI EVALUATED'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </header>

        <nav className="dashboard-tab-bar">
          <div className="tab-slider-pill" ref={sliderRef}></div>
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                ref={(el) => { tabRefs.current[tab.id] = el; }}
                className={`tab-trigger ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={14} /> <span>{tab.label}</span>
              </button>
            );
          })}
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
                      <p className="recommendation-value">
                        <InlineMarkdown>{analysisData.review.hiringRecommendation}</InlineMarkdown>
                      </p>
                    </div>
                  )}
                  <div className="review-split-grid">
                    {analysisData.review?.strengths && (
                      <div className="review-split-box strength-card">
                        <div className="box-header green-neon"><CheckCircle size={14} /> <span>SYSTEM STRENGTHS</span></div>
                        <ul className="bullet-insights">
                          {analysisData.review.strengths.map((str, idx) => (
                            <li key={idx}><InlineMarkdown>{str}</InlineMarkdown></li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {analysisData.review?.weaknesses && (
                      <div className="review-split-box weakness-card">
                        <div className="box-header red-neon"><AlertTriangle size={14} /> <span>CRITICAL DEPRECIATIONS</span></div>
                        <ul className="bullet-insights">
                          {analysisData.review.weaknesses.map((wk, idx) => (
                            <li key={idx}><InlineMarkdown>{wk}</InlineMarkdown></li>
                          ))}
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
                          <h3 className="explicit-question-string"><InlineMarkdown>{q.question}</InlineMarkdown></h3>
                        </div>
                        {q.difficulty && <span className={`difficulty-flag ${q.difficulty.toLowerCase()}`}>{q.difficulty.toUpperCase()}</span>}
                      </div>
                      {q.answerTopics && q.answerTopics.length > 0 && (
                        <div className="answer-row-node">
                          <div className="answer-indicator-label">EXPECTED CRITERIA ANSWER:</div>
                          <div className="topics-inline-wrapper">
                            {q.answerTopics.map((topic, tIdx) => (
                              <span key={tIdx} className="explicit-topic-badge"><InlineMarkdown>{topic}</InlineMarkdown></span>
                            ))}
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
                        <p className="roast-pure-text"><InlineMarkdown>{line}</InlineMarkdown></p>
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
        style={{ display: 'none', position: 'absolute', left: '-9999px', width: '780px' }}
      >
        <div className="pdf-watermark-overlay"></div>
        <div className="pdf-internal-content-wrapper">

          <div className="pdf-compiled-header">
            <div className="pdf-header-main">
              <h2>REPOLENS AI ASSESSMENT</h2>
              {overallScore != null && (
                <div className="pdf-score-box">
                  <span className="label">AI SCORE:</span>
                  <span className="val">{overallScore}/100</span>
                </div>
              )}
            </div>
            <p className="pdf-target-url">TARGET STREAM: {analysisData.repoUrl}</p>
          </div>

          <div className="pdf-section-container printable-node-block">
            <h3 className="pdf-section-title">01 / CORE ARCHITECTURAL EVALUATION</h3>
            {analysisData.review?.hiringRecommendation && (
              <div className="pdf-meta-strip">
                <strong>ASSESSMENT TRACK:</strong> <InlineMarkdown>{analysisData.review.hiringRecommendation}</InlineMarkdown>
              </div>
            )}
            <div className="pdf-split-row">
              {analysisData.review?.strengths && (
                <div className="pdf-split-col">
                  <h4 className="green-text">[+] DETECTED STRENGTHS</h4>
                  <ul>
                    {analysisData.review.strengths.map((str, i) => (
                      <li key={i}><InlineMarkdown>{str}</InlineMarkdown></li>
                    ))}
                  </ul>
                </div>
              )}
              {analysisData.review?.weaknesses && (
                <div className="pdf-split-col">
                  <h4 className="red-text">[-] SYSTEM DEPRECIATIONS</h4>
                  <ul>
                    {analysisData.review.weaknesses.map((wk, i) => (
                      <li key={i}><InlineMarkdown>{wk}</InlineMarkdown></li>
                    ))}
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
                      <strong>Q{i + 1}. <InlineMarkdown>{q.question}</InlineMarkdown></strong>
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
                      <code>[FLAG_{i + 1}]</code> <span><InlineMarkdown>{line}</InlineMarkdown></span>
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
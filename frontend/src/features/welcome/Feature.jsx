import React from 'react';
import '../../style/feature.scss';

const Feature = () => {
  const featuresList = [
    {
      id: '01',
      title: 'Repository Analysis',
      points: [
        'Extracts repository metadata using GitHub API',
        'Detects programming language and project information',
        'Retrieves repository structure and file tree',
        'Extracts README and package.json automatically'
      ],
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      )
    },
    {
      id: '02',
      title: 'AI Interview Preparation',
      points: [
        'Generates Beginner Level Questions',
        'Generates Intermediate Level Questions',
        'Generates Advanced Level Questions',
        'Includes expected answer topics and difficulty levels'
      ],
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      )
    },
    {
      id: '03',
      title: 'Recruiter Review',
      points: [
        'Technical complexity evaluation',
        'Code organization assessment',
        'Scalability review',
        'Documentation quality analysis',
        'Hiring recommendation and project score'
      ],
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="8.5" cy="7" r="4" />
          <polyline points="17 11 19 13 23 9" />
        </svg>
      )
    },
    {
      id: '04',
      title: 'AI README Generator',
      points: [
        'Generates professional README.md files',
        'Creates installation and usage guides',
        'Improves project presentation for recruiters'
      ],
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      )
    },
    {
      id: '05',
      title: 'Roast Mode 🔥',
      points: [
        'Fun AI-generated repository roasting',
        'Constructive and developer-friendly feedback',
        'Highlights project weaknesses humorously'
      ],
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
        </svg>
      )
    }
  ];

  return (
    <section id="features" className="features">
      <div className="features__container">
        
        {/* Section Header */}
        <div className="features__header">
          <h2 className="features__main-title">
            Everything you need to <span className="features__gradient-text">Understand Repos</span>
          </h2>
          <p className="features__subtitle">
            Analyze code, prep for interviews, and get recruiter feedback instantly.
          </p>
        </div>

        {/* Features Grid Layout */}
        <div className="features__grid">
          {featuresList.map((feat) => (
            <div key={feat.id} className="features__card">
              <div className="features__card-glow"></div>
              
              <div className="features__card-top">
                <div className="features__card-icon-box">
                  {feat.icon}
                </div>
                <span className="features__card-id">{feat.id}</span>
              </div>

              <h3 className="features__card-title">{feat.title}</h3>
              
              {/* Clean Simple Bullet Points */}
              <ul className="features__card-list">
                {feat.points.map((point, index) => (
                  <li key={index} className="features__card-item">
                    <span className="features__card-bullet">•</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Feature;
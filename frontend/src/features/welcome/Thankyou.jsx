import React from 'react';
import '../../style/thank.scss';

const Thankyou = () => {
  const techStack = [
    {
      category: 'Frontend',
      items: ['React.js', 'Tailwind CSS', 'Axios']
    },
    {
      category: 'Backend',
      items: ['Node.js', 'Express.js', 'MongoDB', 'Mongoose']
    },
    {
      category: 'AI Models',
      items: ['Gemini 2.5 Flash Lite', 'Mistral Medium']
    },
    {
      category: 'APIs',
      items: ['GitHub REST API']
    }
  ];

  return (
    <section className="thankyou">
      <div className="thankyou__container">
        
        {/* Top Header Card */}
        <div className="thankyou__main-card">
          <h2 className="thankyou__title">Thank You</h2>
          <p className="thankyou__subtitle">
            Thanks for checking out RepoLens! If you want to see more projects or connect, explore my portfolio below.
          </p>
          <a 
            href="https://portfolio2-three-sable.vercel.app/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="thankyou__portfolio-btn"
          >
            <span>Explore My Work</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </a>
        </div>

        {/* --- Tech Stack Section --- */}
        <div className="thankyou__stack-section">
          <div className="thankyou__stack-header">
            <span className="thankyou__stack-badge">SYSTEM ARCHITECTURE</span>
            <h3 className="thankyou__stack-title">Tech Stack</h3>
          </div>

          <div className="thankyou__stack-grid">
            {techStack.map((stack, idx) => (
              <div key={idx} className="thankyou__stack-card">
                <h4 className="thankyou__stack-category">{stack.category}</h4>
                <ul className="thankyou__stack-list">
                  {stack.items.map((item, i) => (
                    <li key={i} className="thankyou__stack-item">
                      <span className="thankyou__stack-indicator"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Thankyou;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../style/login.scss';
import useauth from './hooks/useauth';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
const {handlelogin} = useauth()
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  async function handlesubmit(e){
e.preventDefault()
const res = await handlelogin(formData.email,formData.password)
if(res){
  navigate('/dashboard')
}

  }

  return (
    <div className="terminal-screen">
      
     
      <div className="phone-hardware">
        <div className="phone-hardware__volume-up"></div>
        <div className="phone-hardware__volume-down"></div>
        <div className="phone-hardware__power-key"></div>

        <div className="phone-display">
          <div className="phone-display__island-notch"></div>

          {/* Top Banner with Space Astronaut Vibe */}
          <div className="terminal-banner">
            <div className="terminal-banner__overlay"></div>
            <img 
              src="https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=600&auto=format&fit=crop" 
              alt="Space Station Console" 
              className="terminal-banner__img"
            />
          </div>

          {/* --- CONTENT AREA (HIGH TEXT VISIBILITY) --- */}
          <div className="terminal-content">
            
            {/* Header: Clear indicator that this is the login zone */}
            <div className="terminal-content__header-zone">
              <span className="terminal-content__page-title">LOGIN TERMINAL</span>
              <div className="terminal-content__status-indicator">
                <span className="pulse-dot"></span>
                <span className="status-text">ONLINE</span>
              </div>
            </div>

      

            {/* --- FORMS (Highly Visible Inputs) --- */}
            <form className="terminal-form" autoComplete="off" onSubmit={handlesubmit}>
              
              <div className="terminal-form__group">
                <label className="terminal-form__label">EMAIL ADDRESS</label>
                <input 
                  type="email" 
                  name="email"
                  placeholder="operator@repolens.app" 
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="new-email"
                  required
                  className="terminal-form__input"
                />
              </div>

              <div className="terminal-form__group">
                <label className="terminal-form__label">ACCESS PASSWORD</label>
                <div className="terminal-form__pass-wrapper">
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    name="password"
                    placeholder="ENTER SECRET KEY" 
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    required
                    className="terminal-form__input"
                  />
                  <button 
                    type="button" 
                    className="terminal-form__eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    )}
                  </button>
                </div>
              </div>

              <button type="submit" className="terminal-form__submit-btn">
                AUTHENTICATE IDENTITY
              </button>
            </form>

            {/* Bottom Elements */}
            <div className="terminal-content__bottom-row">
              <div className="terminal-content__pagination">
                <span className="dot dot--active"></span>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
              
              <div className="terminal-content__footer-link">
                <span onClick={() => navigate('/register')}>REGISTER ACCOUNT</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
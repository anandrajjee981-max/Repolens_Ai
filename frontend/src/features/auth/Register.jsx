import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../style/login.scss'; // New linked styles module
import useauth from './hooks/useauth';
const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
const {handleregister} = useauth()
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    const res = await handleregister(formData.username,formData.email,formData.password)
if(res){
  navigate('/dashboard')
}

  };

  return (
    <div className="terminal-screen">
      
      {/* --- MATCHING COMPACT PHONE SHELL --- */}
      <div className="phone-hardware">
        <div className="phone-hardware__volume-up"></div>
        <div className="phone-hardware__volume-down"></div>
        <div className="phone-hardware__power-key"></div>

        <div className="phone-display">
          <div className="phone-display__island-notch"></div>

          {/* Top Banner mirroring same terminal architecture */}
          <div className="terminal-banner">
            <div className="terminal-banner__overlay"></div>
            <img 
              src="https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=600&auto=format&fit=crop" 
              alt="Space Station Console System" 
              className="terminal-banner__img"
            />
          </div>

          {/* --- MAIN OPERATOR INTERACTIVE PANEL --- */}
          <div className="terminal-content">
            
            {/* Header Area declaring Registration zone */}
            <div className="terminal-content__header-zone">
              <span className="terminal-content__page-title">REGISTER TERMINAL</span>
              <div className="terminal-content__status-indicator">
                <span className="pulse-dot pulse-dot--register"></span>
                <span className="status-text status-text--register">NEW NODE</span>
              </div>
            </div>

          

            {/* --- CORE SIGN UP INPUTS --- */}
            <form className="terminal-form" autoComplete="off" onSubmit={handleSubmit}>
              
              {/* Username Input Field */}
              <div className="terminal-form__group">
                <label className="terminal-form__label"> USERNAME</label>
                <input 
                  type="text" 
                  name="username"
                  placeholder="e.g., ghost_operator" 
                  value={formData.username}
                  onChange={handleChange}
                  autoComplete="new-username"
                  required
                  className="terminal-form__input"
                />
              </div>

              {/* Email Input Field */}
              <div className="terminal-form__group">
                <label className="terminal-form__label">EMAIL ADDRESS</label>
                <input 
                  type="email" 
                  name="email"
                  placeholder="identity@repolens.app" 
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="new-email"
                  required
                  className="terminal-form__input"
                />
              </div>

              {/* Password Input Field with togglable visibility indicator */}
              <div className="terminal-form__group">
                <label className="terminal-form__label">CHOOSE ACCESS PASSWORD</label>
                <div className="terminal-form__pass-wrapper">
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    name="password"
                    placeholder="CREATE SECRET KEY" 
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
                CREATE IDENTITY TERMINAL
              </button>
            </form>

            {/* Dynamic Bottom Controls Bar */}
            <div className="terminal-content__bottom-row">
              <div className="terminal-content__pagination">
                <span className="dot"></span>
                <span className="dot dot--active"></span>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
              
              <div className="terminal-content__footer-link">
                <span onClick={() => navigate('/login')}>EXISTING OPERATOR? LOGIN</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
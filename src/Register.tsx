import React, { useState } from 'react';
import { Language } from './languages';
import LanguageSelectorPopup from './LanguageSelectorPopup';

interface RegisterProps {
  onRegister: (email: string, password: string, fullName: string) => void;
  onSwitchToLogin: () => void;
  isLoading: boolean;
  error: string;
  currentLanguage: Language;
  t: (key: string) => string;
  onLanguageChange: (language: Language) => void;
}

const Register: React.FC<RegisterProps> = ({ onRegister, onSwitchToLogin, isLoading, error, currentLanguage, t, onLanguageChange }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showLanguagePopup, setShowLanguagePopup] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return;
    }
    
    onRegister(email, password, fullName);
  };

  return (
    <div className="login-container">
      <button 
        className="language-btn"
        onClick={() => setShowLanguagePopup(true)}
      >
        <span className="language-btn-icon">🌍</span>
        {currentLanguage.nativeName}
      </button>
      
      <div className="login-card">
        <div className="login-header">
          <h1>{t('loginTitle')}</h1>
          <p>Create your account to get started</p>
        </div>
        
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">{t('email')}</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('email')}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">{t('password')}</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('password')}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
            />
          </div>
          
          {password !== confirmPassword && confirmPassword && (
            <div className="error-message">
              Passwords do not match
            </div>
          )}
          
          <button
            type="submit"
            className="login-btn"
            disabled={isLoading || !email || !password || !fullName || password !== confirmPassword}
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
        </form>
        
        <div className="login-footer">
          <p>Already have an account? <button onClick={onSwitchToLogin} className="link-btn">Sign In</button></p>
        </div>
      </div>
      
      <LanguageSelectorPopup
        isOpen={showLanguagePopup}
        onClose={() => setShowLanguagePopup(false)}
        onLanguageSelect={(language) => {
          onLanguageChange(language);
          setShowLanguagePopup(false);
        }}
        currentLanguage={currentLanguage}
      />
    </div>
  );
};

export default Register; 
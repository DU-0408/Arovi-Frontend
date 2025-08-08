import React, { useState } from 'react';
import { Language } from './languages';
import LanguageSelectorPopup from './LanguageSelectorPopup';

interface LoginProps {
  onLogin: (email: string, password: string) => void;
  onSwitchToRegister: () => void;
  isLoading: boolean;
  error: string;
  currentLanguage: Language;
  t: (key: string) => string;
  onLanguageChange: (language: Language) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onSwitchToRegister, isLoading, error, currentLanguage, t, onLanguageChange }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showLanguagePopup, setShowLanguagePopup] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
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
          <p>{t('loginSubtitle')}</p>
        </div>
        
        <form className="login-form" onSubmit={handleSubmit}>
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
          
          <button
            type="submit"
            className="login-btn"
            disabled={isLoading || !email || !password}
          >
            {isLoading ? t('signingIn') : t('signIn')}
          </button>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
        </form>
        

        
        <div className="login-footer">
          <p>Don't have an account? <button onClick={onSwitchToRegister} className="link-btn">Create Account</button></p>
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

export default Login; 
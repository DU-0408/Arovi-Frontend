import React, { useState } from 'react';
import { Language, getTranslation } from './languages';
import LanguageSelectorPopup from './LanguageSelectorPopup';

interface LandingPageProps {
  onNavigateToLogin: () => void;
  onNavigateToRegister: () => void;
  currentLanguage: Language;
  onLanguageChange: (language: Language) => void;
  isDarkMode: boolean;
}

const LandingPage: React.FC<LandingPageProps> = ({
  onNavigateToLogin,
  onNavigateToRegister,
  currentLanguage,
  onLanguageChange,
  isDarkMode
}) => {
  const [showLanguagePopup, setShowLanguagePopup] = useState(false);

  const t = (key: string) => {
    return getTranslation(currentLanguage.code, key);
  };

  return (
    <div className={`landing-page ${isDarkMode ? 'dark' : 'light'}`}>
      {/* Language Selector Button */}
      <button 
        className="landing-language-btn"
        onClick={() => setShowLanguagePopup(true)}
      >
        <span className="language-btn-icon">🌍</span>
        {currentLanguage.nativeName}
      </button>

      {/* Hero Section */}
      <div className="landing-hero">
        <div className="hero-content">
          <div className="hero-icon">🩺</div>
          <h1 className="hero-title">{t('landingTitle')}</h1>
          <p className="hero-subtitle">{t('landingSubtitle')}</p>
          <p className="hero-description">{t('landingDescription')}</p>
          
          {/* Feature List */}
          <div className="hero-features">
            {[1, 2, 3, 4].map((index) => (
              <div key={index} className="feature-item">
                <span className="feature-icon">✨</span>
                <span>{t(`landingFeature${index}`)}</span>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="hero-actions">
            <button 
              className="hero-btn primary"
              onClick={onNavigateToLogin}
            >
              {t('landingLoginButton')}
            </button>
            <button 
              className="hero-btn secondary"
              onClick={onNavigateToRegister}
            >
              {t('landingRegisterButton')}
            </button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="landing-decoration">
          <div className="floating-icon" style={{ top: '10%', left: '10%', animationDelay: '0s' }}>🩹</div>
          <div className="floating-icon" style={{ top: '20%', right: '15%', animationDelay: '1s' }}>💊</div>
          <div className="floating-icon" style={{ bottom: '30%', left: '20%', animationDelay: '2s' }}>🩺</div>
          <div className="floating-icon" style={{ bottom: '20%', right: '10%', animationDelay: '3s' }}>🏥</div>
        </div>
      </div>

      {/* Language Selector Popup */}
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

export default LandingPage; 